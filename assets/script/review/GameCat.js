
const PRE_FAB_NAME = 'prefab/word_item'
const SPRITE_NAME = 'texture/pic_wg_xiaoyu'

cc.Class({
  extends: cc.Component,

  properties: {
    parent: {
      type: cc.Node,
      default: null
    },
    cat: {
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

  initPrefab(fish, position) {
    this.parent.addChild(fish)
    const script = fish.getComponent('WordItem')
    cc.resources.load(SPRITE_NAME, cc.SpriteFrame, (error, sprite) => {
      script.init({
        position,
        sprite,
        textColor: new cc.Color(0, 0, 0),
        callback: () => {
          if (this.cat.getComponent('CollideListener').canEat()) {
            this.successFish(fish)
          } else {
            script.backTween()
          }
        }
      })
    })
  },

  successFish(fish) {
    cc.tween(fish).to(0.5, { position: cc.v2(130, -8), scale: 0 }, { easing: 'fade' }).call(() => {
      fish.active = false
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
