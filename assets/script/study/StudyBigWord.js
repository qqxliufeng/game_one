
cc.Class({
  extends: cc.Component,

  properties: {
    word: cc.Node
  },

  onLoad() {
    this.isPlaying = false
    this.word = this.node.getChildByName('word')
  },

  init(params) {
    if (!params) throw new Error('初始化参数为空')
    this.scheduleOnce(() => {
      this.setPosition(params.position)
      this.setBackgroundSprite(params.sprite)
      this.setTextFont(params.textFont)
      this.setScale()
      this.defaultScale = params.scale
    }, 0)
  },

  refresh(params) {
    this.scheduleOnce(() => {
      console.log('refresh')
      this.setTextFont(params ? params.textFont : null)
      this.setScale()
      this.scaleTween()
    }, 0)
  },

  setPosition(position = new cc.v2(0, 0)) {
    this.node.setPosition(position)
  },

  setBackgroundSprite(sprite) {
    this.node.getComponent(cc.Sprite).spriteFrame = sprite
  },

  setTextFont(textFont = {}) {
    if (!textFont) return
    if (textFont && textFont.color && textFont.color instanceof cc.Color) this.word.color = textFont.color
    this.word.getComponent(cc.Label).string = textFont.label || '优'
  },

  setScale() {
    this.node.scale = 0
  },

  scaleTween() {
    if (this.isPlaying) return
    this.isPlaying = true
    cc.tween(this.node).to(1, { scale: this.defaultScale, angle: (this.node.angle ? this.angle : 360) }, { easing: 'elasticOut' }).call(() => {
      this.node.angle = 0
      this.isPlaying = false
    }).start()
  }
});
