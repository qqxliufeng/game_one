
cc.Class({
  extends: cc.Component,

  init({ startPosition, endPosition }) {
    this.node.active = false
    this.node.position = startPosition
    this.node.zIndex = 1
    this.node.active = true
    const tween = cc.tween(this.node)
      .to(1.5, { position: endPosition })
      .call(() => {
        this.node.position = startPosition
        tween.start()
      })
      .start()
  }
})
