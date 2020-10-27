
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
      this.defaultPosition = params.position
      this.wordAudioPath = params.wordAudioPath || 'http://192.168.1.104:7456/app/editor/static/img/make.mp3'
      this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
    }, 0)
  },

  refresh(params) {
    this.scheduleOnce(() => {
      this.setTextFont(params ? params.textFont : null)
      switch (params.type) {
        case 'car':
          this.carTransition()
          break
        case 'flower':
        case 'sun':
          this.scaleTween()
          break
        case 'mushroom':
          this.mushroomTransition()
          break
        case 'apple':
          this.appleTransition()
          break
        case 'book':
          this.bookTransition()
          break
      }
    }, 0)
  },

  touchEnd() {
    playRemoteAudio(this.wordAudioPath)
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
    if (textFont.position) this.word.setPosition(textFont.position || cc.v2(0, 0))
    this.word.getComponent(cc.Label).string = textFont.label || '优'
  },

  setScale() {
    this.node.scale = 0
  },

  scaleTween() {
    this.node.scale = 0
    if (this.isPlaying) return
    this.isPlaying = true
    cc.tween(this.node).to(1, { scale: this.defaultScale, angle: (this.node.angle ? this.angle : 360) }, { easing: 'elasticOut' }).call(() => {
      this.node.angle = 0
      this.isPlaying = false
    }).start()
  },

  carTransition() {
    this.node.scale = this.defaultScale
    this.node.setPosition(cc.v2(this.defaultPosition.x - this.node.parent.width / 2, this.defaultPosition.y))
    cc.tween(this.node).to(1, { position: cc.v2(this.defaultPosition.x, this.defaultPosition.y) }, { easing: 'elasticOut' }).start()
  },

  appleTransition() {
    this.node.scale = 0
    this.node.setPosition(cc.v2(this.defaultPosition.x, this.defaultPosition.y + this.node.parent.height))
    cc.tween(this.node).to(2, { position: cc.v2(this.defaultPosition.x, this.defaultPosition.y), scale: this.defaultScale }, { easing: 'elasticOut' }).start()
  },

  mushroomTransition() {
    this.node.scale = 0
    cc.tween(this.node).to(1, { scale: this.defaultScale }, { easing: 'elasticOut' }).start()
  },

  bookTransition() {
    this.node.opacity = 0
    this.node.scale = this.defaultScale
    this.node.setPosition(cc.v2(this.defaultPosition.x, this.defaultPosition.y - this.node.height / 2))
    cc.tween(this.node).to(0.5, { position: cc.v2(this.defaultPosition.x, this.defaultPosition.y), opacity: 255 }).start()
  }
});
