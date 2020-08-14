
const PRE_FAB_NAME = 'prefab/word_item'
const SPRITE_NAME = 'texture/pic_wg_guanzi'

cc.Class({
  extends: cc.Component,

  properties: {
    parent: {
      type: cc.Node,
      default: null
    },
    bear: {
      type: cc.Node,
      default: null
    },
    successTip: {
      type: cc.AudioClip,
      default: null
    },
    errorTip: {
      type: cc.AudioClip,
      default: null
    }
  },

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
      this.initPrefab(cc.instantiate(assets), 'left')
    })
    cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
      this.initPrefab(cc.instantiate(assets), 'right')
    })
  },

  initPrefab(bear, position) {
    cc.resources.load(SPRITE_NAME, cc.SpriteFrame, (error, sprite) => {
      this.parent.addChild(bear)
      const script = bear.getComponent('WordItem')
      script.init({
        position,
        sprite,
        textColor: new cc.Color(255, 255, 255),
        callback: () => {
          if (this.bear.getComponent('CollideListener').canEat()) {
            this.success(bear)
          } else {
            script.backTween()
          }
        }
      })
    })
  },

  success(bear) {
    cc.tween(bear).to(0.5, { position: cc.v2(-150, 85), scale: 0 }, { easing: 'fade' }).call(() => {
      bear.active = false
      cc.audioEngine.play(this.successTip, false, 1)
    }).start()
  },

  errorFish(script) {
    script.backTween()
    cc.audioEngine.play(this.errorTip, false, 1)
  },

  start() { },

  // update (dt) {},

  onDestroy() {
    cc.resources.releaseAll()
  }

});
