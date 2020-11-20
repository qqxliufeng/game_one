const { getReviewScene, getStudyScene, getGameScene, getApplyScene, getLevelScene } = require("./utils/globals");

cc.Class({
  extends: cc.Component,

  properties: {
    parent1: cc.Node,
    parent2: cc.Node,
    logo: cc.Node
  },

  onLoad() {
    // 默认的游戏类型是---study
    // 所有的游戏类型是：review(复习)、study(学习)、game(游戏)、apply(运用)、level(闯关)
    const urlParams = new URLSearchParams(location.search)
    const gameType = urlParams.get('type') || 'apply'
    this.sceneName = ''
    switch (gameType) {
      case 'reviewOrStudy':
        this.parent1.active = false
        this.audioName = 'start_study'
        this.parent2.getChildByName('review').on('click', () => {
          this.sceneName = getReviewScene()
          this.playAudio()
        }, this)
        this.parent2.getChildByName('study').on('click', () => {
          this.sceneName = getStudyScene()
          this.playAudio()
        }, this)
        break
      case 'game':
        this.parent2.active = false
        this.audioName = 'dwct'
        cc.resources.load('texture/welcome', cc.SpriteAtlas, (error, atlas) => {
          if (error) return
          this.logo.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('pic_yy_dwct')
          this.startTween()
          this.parent1.getChildByName('start').on('click', () => {
            this.sceneName = getGameScene()
            this.playAudio()
          }, this)
        })
        break
      case 'apply':
        this.parent2.active = false
        this.audioName = 'cydzz'
        cc.resources.load('texture/welcome', cc.SpriteAtlas, (error, atlas) => {
          if (error) return
          this.logo.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('pic_yy_cydzz')
          this.startTween()
          this.parent1.getChildByName('start').on('click', () => {
            this.sceneName = getApplyScene()
            this.playAudio()
          }, this)
        })
        break
      case 'level':
        this.parent2.active = false
        this.audioName = 'sldbp'
        cc.resources.load('texture/welcome', cc.SpriteAtlas, (error, atlas) => {
          if (error) return
          this.logo.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame('pic_yy_sldbp')
          this.startTween()
          this.parent1.getChildByName('start').on('click', () => {
            this.sceneName = getLevelScene()
            this.playAudio()
          }, this)
        })
        break
      default:
        this.parent1.active = false
        this.sceneName = getStudyScene()
    }
    cc.director.once('wxload', () => {
      this.playAudio()
    }, this)
  },

  startTween() {
    const defaultScale = this.logo.scale
    this.logo.scale = 2
    cc.tween(this.logo).to(1, { scale: defaultScale }, { easing: 'elasticOut' }).start()
  },

  playAudio() {
    cc.resources.load('audio/' + this.audioName, cc.AudioClip, (error, audioClip) => {
      const id = cc.audioEngine.play(audioClip, false, 1)
      cc.audioEngine.setFinishCallback(id, () => {
        cc.director.loadScene(this.sceneName)
      })
    })
  }
})
