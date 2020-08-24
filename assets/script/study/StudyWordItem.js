
cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)

  },

  start() {
  },

  touchMove(e) {
    this.node.setPosition(this.node.x + e.getDeltaX(), this.node.y + e.getDeltaY())
  },

  touchEnd() {
    cc.tween(this.node).to(1, { position: this.defaultPosition }, { easing: 'elasticOut' }).start()
  },

  init(params) {
    this.scheduleOnce(() => {
      this.setContentSize(params.size)
      this.setPosition(params.position)
      this.setBackgroundSprite(params.sprite)
      this.setTextFont(params.textFont)
      this.clickCallBack = params.clickCallBack
    }, 0)
  },

  setContentSize(size) {
    this.node.setContentSize(parseInt(size.width), parseInt(size.height))
    this.node.getChildByName('button').setContentSize(parseInt(size.width), parseInt(size.height))
    this.node.getChildByName('button').on('click', this.setOnClickListener.bind(this))
  },

  setPosition(position = new cc.v2(0, 0)) {
    this.node.setPosition(position)
    this.defaultPosition = position
  },

  setBackgroundSprite(sprite) {
    this.node.getComponent(cc.Sprite).spriteFrame = sprite
  },

  setOnClickListener() {
    this.clickCallBack && this.clickCallBack(this.node.getChildByName('word').getComponent(cc.Label).string)
  },

  setTextFont(text = {}) {
    const wordNode = this.node.getChildByName('word')
    wordNode.color = text.color
    if (text.position) {
      wordNode.setPosition(text.position)
    }
    wordNode.getComponent(cc.Label).string = text.label
  }
});
