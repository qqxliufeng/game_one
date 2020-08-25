cc.Class({
  extends: cc.Component,

  onLoad() {
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
    this.scheduleOnce(() => {
      this.setParentParams(params.parentParams)
      this.setSpriteParams(params.spriteParams)
      this.setTextParams(params.textParams)
      this.setOtherParams(params.otherParams)
    })
  },

  /**
   * 设置父元素的信息：
   * 位置，偏移量
   * 大小
   * 缩放
   * @param {*} callback 
   */
  setParentParams({ x = 0, y = 0, width = 100, height = 100, padding = 0, scale = 1 }) {
    this.node.x = x + padding
    this.node.y = y + padding
    this.node.setContentSize(width, height)
    this.node.scale = scale
    this.defaultPosition = this.node.getPosition()
    this.defaultScale = this.node.scale
    const boxCollider = this.node.addComponent(cc.BoxCollider)
    boxCollider.size = cc.size(width * 2, height * 2)
  },

  /**
   * 设置图片精灵信息：
   * 图片
   * @param {*} callback 
   */
  setSpriteParams({ spriteFrame }) {
    this.getComponent(cc.Sprite).spriteFrame = spriteFrame
  },

  /**
   * 设置文字信息:
   * 文字
   * 位置
   * 颜色
   * 大小
   * @param {*} callback 
   */
  setTextParams({ x = 0, y = 0, label = '', fontSize = 40, color = new cc.Color(0, 0, 0) }) {
    const textNode = this.node.getChildByName('word')
    const textComponent = textNode.getComponent(cc.Label)
    textComponent.string = label
    textComponent.fontSize = fontSize
    textNode.setPosition(x, y)
    textNode.color = color
  },

  /**
   * 单独设置一下文本字
   * @param {*} otherParams 
   */
  setText(label = '') {
    const textNode = this.node.getChildByName('word')
    const textComponent = textNode.getComponent(cc.Label)
    textComponent.string = label
  },

  /**
   * 设置其它信息：
   * 触摸之后的回调函数
   * @param {*} callback 
   */
  setOtherParams(otherParams) {
    this.callback = otherParams.callback
  }
});
