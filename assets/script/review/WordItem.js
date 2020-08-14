cc.Class({
  extends: cc.Component,

  onLoad() {
    this.defaultScale = this.node.scale
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
  },

  touchMove(e) {
    this.node.setPosition(this.node.x + e.getDeltaX(), this.node.y + e.getDeltaY())
    this.node.scale = Math.min(this.defaultScale, Math.max(0.3, 1 - cc.v2(this.node.x, this.node.y).sub(cc.v2(this.defaultPosition.x, this.defaultPosition.y)).len() / 500))
  },

  touchEnd(e) {
    if (this.callback) {
      this.callback()
    } else {
      this.backTween()
    }
  },

  backTween() {
    // cc.audioEngine.play(this.errorClip, false, 1)
    cc.tween(this.node).to(1, { position: this.defaultPosition, scale: this.defaultScale }, { easing: 'elasticOut' }).start()
  },

  /**
   * 初始化预制体
   * @param {*} params 
   */
  init(params) {
    this.setSpriteFrame(params.sprite)
    this.setTextFont(params.textColor)
    this.setPosition(params.position)
    this.setTouchResultCallBack(params.callback)
    this.setWordPosition(params.wordPosition)
  },

  /**
   * 设置触摸之后的回调函数
   * @param {*} callback 
   */
  setTouchResultCallBack(callback) {
    this.callback = callback
  },

  /**
   * 设置字的背景图片
   * @param {*} sprite 
   */
  setSpriteFrame(sprite) {
    this.getComponent(cc.Sprite).spriteFrame = sprite
    this.node.addComponent(cc.BoxCollider)
  },

  /**
   * 设置文字颜色
   * @param {*} textColor 
   */
  setTextFont(textColor = new cc.Color(0, 0, 0)) {
    this.scheduleOnce(() => {
      this.node.getChildByName('word').color = textColor
    }, 0)
  },

  /**
   * 设置字的背景位置
   * @param {*} position 
   */
  setPosition(position = 'left') {
    if (position === 'left') {
      this.node.x = (this.node.parent.x - this.node.parent.width / 2) + this.node.width / 2
      this.node.y = (this.node.parent.y - this.node.parent.height / 2) + this.node.width / 2
    } else {
      this.node.x = (this.node.parent.x + this.node.parent.width / 2) - this.node.width / 2
      this.node.y = (this.node.parent.y - this.node.parent.height / 2) + this.node.width / 2
    }
    this.defaultPosition = this.node.getPosition()
  },

  /**
   * 设置文字的位置
   * @param {}} position 
   */
  setWordPosition(position = new cc.v2(0, 0)) {
    this.node.getChildByName('word').setPosition(position)
  },

  start() {
  },

  // update (dt) {},
});
