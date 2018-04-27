import {Scene, Sprite, Label, Group} from 'spritejs'
import Tile from './tile'
import Board from './board'
import delegateEvent from './event'

const defaultConf = {
  boardSize: 4,
  bg: ['#BBADA1', '#CDC0B5'],
  blocks: [
    ['2', '#eee4db', '#776e66'],
    ['4', '#ede0c9', '#776e66'],
    ['8', '#f2b179', '#fff'],
    ['16', '#f59563', '#fff'],
    ['32', '#f67c5f', '#fff'],
    ['64', '#f65e3b', '#fff'],
    ['128', '#edcf72', '#fff'],
    ['256', '#ed4c61', '#fff'],
    ['512', '#9c0', '#fff'],
    ['1024', '#33b5e5', '#fff'],
    ['2048', '#edc22e', '#fff'],
  ],
}

export default class Game {
  constructor(id, options = {}) {
    this.config = Object.assign({}, options, defaultConf)
    const scene = new Scene(id, {viewport: ['auto', 'auto'], resolution: [1500, 2412], stickMode: 'height'})
    this.bglayer = scene.layer(
      'bglayer',
      {handleEvent: true}
    )
    this.fglayer = scene.layer('fglayer')

    this.scene = scene

    delegateEvent(this.fglayer)

    const boardBg = new Sprite(),
      {bg, boardSize} = this.config,
      {bglayer} = this

    boardBg.attr({
      anchor: 0.5,
      pos: [750, 1350],
      size: [1200, 1200],
      bgcolor: bg[0],
    })
    this.bglayer.append(boardBg)

    this.boardBg = boardBg

    const tile = new Tile({
      parent: bglayer,
      dimension: [boardSize, boardSize],
      boundingRect: boardBg.renderRect,
      cellspacing: 30,
    })

    tile.traverse(({w, h, cx, cy, row, col}) => {
      const block = new Sprite()
      block.attr({
        bgcolor: bg[1],
      })
      tile.add(block, row, col)
    })

    const title = new Label('2048')
    title.attr({
      anchor: [0, 1],
      font: 'bold 240px Arial',
      lineHeight: 300,
      pos: [100, 550],
      fillColor: '#776E66',
    })
    bglayer.append(title)

    const scorePanel = new Group()
    scorePanel.attr({
      anchor: [0, 1],
      size: [260, 200],
      bgcolor: '#BBADA1',
      pos: [800, 500],
      borderRadius: 20,
    })

    const scoreLabel = new Label('score')
    scoreLabel.attr({
      fillColor: '#EEE4DB',
      font: '60px Arial',
      pos: [130, 0],
      anchor: [0.5, 0],
    })
    const scoreText = new Label('0')
    scoreText.attr({
      fillColor: '#fff',
      font: '80px Arial',
      pos: [130, 125],
      anchor: [0.5, 0.5],
    })
    scorePanel.append(scoreLabel, scoreText)
    bglayer.append(scorePanel)
    this.scoreText = scoreText

    const bestPanel = new Group()
    bestPanel.attr({
      anchor: [0, 1],
      size: [260, 200],
      bgcolor: '#BBADA1',
      pos: [1100, 500],
      borderRadius: 20,
    })
    bglayer.append(bestPanel)
    const bestLabel = scoreLabel.cloneNode(),
      bestText = scoreText.cloneNode()

    bestLabel.text = 'best'
    bestPanel.append(bestLabel, bestText)
    this.bestText = bestText

    const button = new Label('NewGame')
    button.attr({
      bgcolor: '#8E7A67',
      anchor: 0.5,
      pos: [1050, 610],
      fillColor: '#fff',
      font: '80px Arial',
      zIndex: 99999,
      padding: [10, 30],
      borderRadius: 15,
    })
    bglayer.append(button)

    button.on('mousedown', (evt) => {
      button.attr('scale', 0.9)
    })
    bglayer.on('mouseup', (evt) => {
      button.attr('scale', 1.0)
    })

    const restart = () => {
      localStorage.removeItem('board')
      this.fglayer.off('step')
      this.start()
    }

    button.on('click', restart)
    // bglayer.on('touchstart', restart)
  }
  async loadBoard(boardData, addBlock) {
    const promises = []
    for(let i = 0; i < boardData.length; i++) {
      const row = boardData[i]
      for(let j = 0; j < row.length; j++) {
        const cell = row[j]
        if(cell >= 0) {
          promises.push(addBlock(i, j, cell))
        }
      }
    }
    await Promise.all(promises)
  }
  async start() {
    const {fglayer, boardBg, scoreText, bestText} = this,
      {boardSize, blocks} = this.config

    fglayer.remove()
    scoreText.text = 0

    // 如果是小程序：使用 wx.getStorage
    bestText.text = localStorage.getItem('bestScore') || 0

    const tile = new Tile({
      parent: fglayer,
      dimension: [boardSize, boardSize],
      boundingRect: boardBg.renderRect,
      cellspacing: 30,
    })

    const board = new Board({size: boardSize, maxLevel: blocks.length - 1})
    const h = tile.cellSize[1]

    async function addBlock(i, j, level) {
      if(level == null) {
        level = Math.random() > 0.75 ? 1 : 0
      }
      if(i == null || j == null) {
        [i, j] = board.birth(level)
      } else {
        board.board[i][j] = level
      }
      const [number, bgcolor, fillColor] = blocks[level]

      if(i >= 0 && j >= 0) {
        const score = Number(scoreText.text) + Number(number)
        scoreText.text = score
        if(score > Number(bestText.text)) {
          bestText.text = score
          localStorage.setItem('bestScore', score)
        }

        const block = new Label(number)
        const font = `${86 + 80 / number.length}px Arial`
        block.attr({
          font,
          lineHeight: h,
          textAlign: 'center',
          fillColor,
          bgcolor,
          opacity: 0,
        })

        const anim = block.animate([
          {opacity: 0},
          {opacity: 1},
        ], {
          duration: 100,
          delay: 50,
          fill: 'forwards',
        })

        tile.add(block, i, j)
        await anim.finished
      }
    }

    const boardData = localStorage.getItem('board')
    if(boardData) {
      await this.loadBoard(JSON.parse(boardData).board, addBlock)
    } else {
      await Promise.all([addBlock(), addBlock()])
    }

    let lock = false

    fglayer.on('step', async (evt) => {
      if(lock) return

      const direction = evt.direction
      const changes = board[direction]()
      if(!changes.length) return
      const promises = changes.map(async (change) => {
        const {index, toIndex, value, toValue} = change
        // const sprite = tile.findAt(...index)
        const sprite = await tile.moveTo(index, toIndex)
        if(toValue >= 0 && toValue !== value) {
          const [number, bgcolor, fillColor] = blocks[toValue]
          const font = `${86 + 80 / number.length}px Arial`
          sprite.attr({
            font,
            text: number,
            bgcolor,
            fillColor,
          })
        } else if(toValue < 0) {
          sprite.remove()
        }
      })
      lock = true
      await Promise.all(promises)
      await addBlock()
      if(board.isValid()) {
        localStorage.setItem('board', JSON.stringify(board))
        lock = false
      } else {
        localStorage.removeItem('board')
        alert('游戏结束')
      }
    })

    // window.fglayer = fglayer
    // window.board = board
  }
}
