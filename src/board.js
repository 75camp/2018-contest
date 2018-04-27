import assert from 'assert'

const _row = Symbol('row'),
  _col = Symbol('col')

function check(cells, maxLevel, reverse) {
  const reversed = reverse ? -1 : 1
  cells = cells.map((value, index) => {
    return {value, index}
  })
  cells.sort((a, b) => {
    if(a.value < 0 && b.value >= 0) return reversed
    if(a.value >= 0 && b.value < 0) return -reversed
    return a.index - b.index
  })
  cells.forEach((cell, i) => {
    cell.toIndex = i
  })

  let base = -1,
    offset = 0
  const len = cells.length

  if(reverse) cells = cells.reverse()

  for(let i = 0; i < len; i++) {
    const cell = cells[i]
    if(base >= 0 && base === cell.value && cell.value < maxLevel) {
      cells[i - 1].toValue = cells[i - 1].value + 1
      cell.toValue = -1
      offset -= reversed
      base = -1
    } else {
      cell.toValue = cell.value
      base = cell.value
    }
    cell.toIndex += offset
  }

  return cells.filter(cell => cell.value >= 0)
}

export default class Board {
  constructor({size = 4, maxLevel = 11}) {
    this.options = {size, maxLevel}
    this.storage = []
    this.init()
  }
  init() {
    const size = this.options.size
    this.board = Array.from({length: size}).map(row => new Array(size).fill(-1))
  }
  save() {
    const copied = this.board.map(row => row.slice(0))
    this.storage.push(copied)
  }
  restore() {
    this.board = this.storage.pop()
  }
  birth(level) {
    assert(level <= this.options.maxLevel, 'Too big.')
    const empty = []
    this.board.forEach((row, i) => {
      row.forEach((v, j) => {
        if(v === -1) {
          empty.push([i, j])
        }
      })
    })
    if(empty.length) {
      const idx = Math.floor(empty.length * Math.random())
      const [i, j] = empty[idx]
      this.board[i][j] = level
      return [i, j]
    }
    return [-1, -1]
  }
  getRow(i) {
    const size = this.options.size
    assert(i < size)
    return {row: i, cells: this.board[i].slice(0)}
  }
  getCol(j) {
    const size = this.options.size
    assert(j < size)
    const cells = []
    for(let i = 0; i < size; i++) {
      cells.push(this.board[i][j])
    }
    return {col: j, cells}
  }
  [_row](reverse) {
    const {size, maxLevel} = this.options,
      changes = [],
      board = this.board

    for(let i = 0; i < size; i++) {
      const cells = check(this.getRow(i).cells, maxLevel, reverse)
      for(let j = 0; j < size; j++) {
        board[i][j] = -1
      }
      cells.forEach((cell) => {
        const {index, toIndex, toValue} = cell
        cell.index = [i, index]
        cell.toIndex = [i, toIndex]
        if(toValue >= 0) {
          board[i][toIndex] = toValue
        }
      })
      changes.push(...cells)
    }

    return changes.filter((cell) => {
      return cell.index[0] !== cell.toIndex[0]
        || cell.index[1] !== cell.toIndex[1]
        || cell.value !== cell.toValue
    })
  }
  left() {
    return this[_row]()
  }
  right() {
    return this[_row](true)
  }
  [_col](reverse) {
    const {size, maxLevel} = this.options,
      changes = [],
      board = this.board

    for(let j = 0; j < size; j++) {
      const cells = check(this.getCol(j).cells, maxLevel, reverse)
      for(let i = 0; i < size; i++) {
        board[i][j] = -1
      }
      cells.forEach((cell) => {
        const {index, toIndex, toValue} = cell
        cell.index = [index, j]
        cell.toIndex = [toIndex, j]
        if(toValue >= 0) {
          board[toIndex][j] = toValue
        }
      })
      changes.push(...cells)
    }
    return changes.filter((cell) => {
      return cell.index[0] !== cell.toIndex[0]
        || cell.index[1] !== cell.toIndex[1]
        || cell.value !== cell.toValue
    })
  }
  up() {
    return this[_col]()
  }
  down() {
    return this[_col](true)
  }
  isValid() {
    const size = this.options.size,
      maxLevel = this.options.maxLevel,
      board = this.board

    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        const cell = board[i][j]
        if(cell < 0 || cell < maxLevel && (j < size - 1 && cell === board[i][j + 1]
          || i < size - 1 && cell === board[i + 1][j])) {
          return true
        }
      }
    }
    return false
  }
}