cc.Class({
  extends: cc.Component,

  properties: {
    wordItem1: cc.Node,
    wordItem2: cc.Node,
    targetText1: cc.Label,
    targetText2: cc.Label
  },

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    cc.director.getCollisionManager().enabledDebugDraw = true
    this.initWordItem(this.wordItem1)
    this.initWordItem(this.wordItem2)
    post({
      url: 'doLogin',
      data: {
        phone: '18800000000',
        password: '123123'
      }
    }).then(res => {
      console.log(res)
    })
  },

  initWordItem(wordItem) {
    wordItem.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    wordItem.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
    wordItem.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
    this.wordItem1.rawInfo = {
      position: this.wordItem1.getPosition(),
      scale: this.wordItem1.scale
    }
    this.wordItem2.rawInfo = {
      position: this.wordItem2.getPosition(),
      scale: this.wordItem2.scale
    }
  },

  touchMove(e) {
    e.target.setPosition(e.target.x + e.getDeltaX(), e.target.y + e.getDeltaY())
    e.target.scale = Math.min(e.target.rawInfo.scale, Math.max(0.3, 1 - cc.v2(e.target.x, e.target.y).sub(cc.v2(e.target.rawInfo.position.x, e.target.rawInfo.position.y)).len() / 500))
  },

  touchEnd(e) {
    cc.tween(e.target).to(1, { position: e.target.rawInfo.position, scale: e.target.rawInfo.scale }, { easing: 'elasticOut' }).start()
  },

  onDestroy() {
    this.wordItem1.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    this.wordItem2.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
  }
});
