export default function delegateEvent(layer) {
  if(typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('keydown', (evt) => {
      const {keyCode} = evt,
        directions = ['left', 'up', 'right', 'down']
      const direction = directions[keyCode - 37]
      if(direction) {
        layer.dispatchEvent('step', {direction}, true, true)
      }
    })
    let startX,
      startY
    const precision = 10
    document.addEventListener('touchstart', (evt) => {
      startX = evt.targetTouches[0].clientX
      startY = evt.targetTouches[0].clientY
    })
    document.addEventListener('touchend', (evt) => {
      const {clientX: endX, clientY: endY} = evt.changedTouches ? evt.changedTouches[0] : evt
      const deltaX = Math.abs(endX - startX),
        deltaY = Math.abs(endY - startY)

      let direction
      if(deltaX > deltaY && deltaX > precision) {
        if(endX > startX) {
          direction = 'right'
        } else {
          direction = 'left'
        }
      }
      if(deltaX < deltaY && deltaY > precision) {
        if(endY > startY) {
          direction = 'down'
        } else {
          direction = 'up'
        }
      }
      if(direction) {
        layer.dispatchEvent('step', {direction}, true, true)
      }
    })
    document.documentElement.addEventListener('touchmove', (evt) => {
      evt.preventDefault()
    }, {passive: false})
  }
}