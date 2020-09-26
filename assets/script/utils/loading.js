cc.Class({
  extends: cc.Component,

  properties: {
    loadingImage: cc.Node,
    loadingText: cc.Label
  },

  onLoad() {
    // this.tween = cc.tween(this.loadingImage).by(1, { angle: -360 }).repeatForever()
  },

  show(tip = '正在加载…') {
    this.loadingText.string = tip
    this.node.parent.active = true
    // this.tween.start()
  },

  close() {
    this.node.parent.active = false
    // this.tween.stop()
  }

});
