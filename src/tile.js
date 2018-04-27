export default class Tile {
  constructor({parent, dimension, boundingRect = [0, 0, 0, 0], cellspacing = 0}) {
    this.parent = parent
    this.row = dimension[0]
    this.col = dimension[1]
    this.boundingRect = boundingRect || [0, 0, 0, 0]
    this.cellspacing = cellspacing || 0
  }
  add(sprite, i, j) {
    const [w, h] = this.cellSize,
      [cx, cy] = this.center(i, j)

    sprite.attr({
      anchor: 0.5,
      pos: [cx, cy],
      size: [w, h],
    })
    sprite.tileIndex = [i, j]
    this.parent.append(sprite)
  }
  findAt(i, j) {
    const children = this.parent.children
    return children.filter(child => child.tileIndex && child.tileIndex[0] === i && child.tileIndex[1] === j)
  }
  cell(i, j) {
    const [left, top] = this.boundingRect,
      {cellspacing} = this
    const [w, h] = this.cellSize

    return [left + w * j + cellspacing * (j + 1), top + h * i + cellspacing * (i + 1), w, h]
  }
  get cellSize() {
    const width = this.boundingRect[2],
      height = this.boundingRect[3],
      {row, col, cellspacing} = this
    const w = (width - cellspacing * (col + 1)) / row,
      h = (height - cellspacing * (row + 1)) / col
    return [w, h]
  }
  center(i, j) {
    const [t, l, w, h] = this.cell(i, j)
    return [t + w / 2, l + h / 2]
  }
  traverse(func) {
    const {row, col} = this
    for(let i = 0; i < row; i++) {
      for(let j = 0; j < col; j++) {
        const [x, y, w, h] = this.cell(i, j),
          [cx, cy] = this.center(i, j)
        func.call(this, {x, y, w, h, cx, cy, row: i, col: j})
      }
    }
  }
  traverseRow(row, func) {
    const {col} = this
    for(let j = 0; j < col; j++) {
      const [x, y, w, h] = this.cell(row, j),
        [cx, cy] = this.center(row, j)
      func.call(this, {x, y, w, h, cx, cy, row, col: j})
    }
  }
  traverseCol(col, func) {
    const {row} = this
    for(let i = 0; i < row; i++) {
      const [x, y, w, h] = this.cell(i, col),
        [cx, cy] = this.center(i, col)
      func.call(this, {x, y, w, h, cx, cy, row: i, col})
    }
  }
  async moveTo(fromIndex, toIndex) {
    const [i0, j0] = fromIndex,
      [i1, j1] = toIndex
    const sprite = this.findAt(i0, j0)[0]

    if(i0 === i1 && j0 === j1) {
      return sprite
    }
    const [cx0, cy0] = this.center(i0, j0),
      [cx1, cy1] = this.center(i1, j1)
    const step = Math.max(Math.abs(i1 - i0), Math.abs(j1 - j0))

    if(sprite) {
      const anim = sprite.animate([
        {pos: [cx0, cy0]},
        {pos: [cx1, cy1]},
      ], {
        duration: step * 50,
        fill: 'forwards',
      })

      await anim.finished
      sprite.tileIndex = [i1, j1]
    }
    return sprite
  }
}