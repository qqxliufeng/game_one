cc.Class({
  extends: cc.Component,

  properties: {
    textNode: {
      type: cc.Label,
      default: null
    }
  },

  show(text = '', duration = 2) {
    this.node.active = true
    this.node.opacity = 0
    this.textNode.string = text
    cc.tween(this.node).to(duration, { opacity: 255 }, { easing: 'elasticOut' }).call(() => {
      this.node.active = false
    }).start()
  }

});
