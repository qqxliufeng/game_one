cc.Class({
  extends: cc.Component,

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
  },

  touchEnd() {
    this.playAudio && this.playAudio(this.node.text)
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
  setParentParams({ x = 0, y = 0, width = 100, height = 100, padding = 0, scale = 1, addCollider = true }) {
    this.node.x = x + padding
    this.node.y = y + padding
    this.node.setContentSize(width, height)
    this.node.scale = scale
    this.defaultPosition = this.node.getPosition()
    this.defaultScale = this.node.scale
    if (addCollider) {
      const boxCollider = this.node.addComponent(cc.BoxCollider)
      boxCollider.size = cc.size(width * 2, height * 2)
    }
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
    textNode.active = !!label
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
    this.playAudio = otherParams.playAudio
  }
});
