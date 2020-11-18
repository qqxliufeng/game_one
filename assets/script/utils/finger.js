
cc.Class({
  extends: cc.Component,

  init({ startPosition, endPosition }) {
    this.reset()
    this.node.position = startPosition
    this.node.active = true
    this.tween = cc.tween(this.node)
      .to(1.5, { position: endPosition })
      .call(() => {
        this.node.position = startPosition
        this.tween.start()
      })
      .start()
  },

  reset() {
    this.node.position = cc.v2(0, 0)
    this.tween && this.tween.stop()
    this.node.active = false
    this.node.zIndex = 1
  }
})
