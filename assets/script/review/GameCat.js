const BaseClass = require('../utils/BaseClass')

const SPRITE_NAME = 'texture/pic_wg_xiaoyu'

cc.Class({
  extends: BaseClass,

  onLoad() {
    this.initWordItem(SPRITE_NAME)
  },

  initPrefab(word, position, sprite) {
    this.parent.addChild(word)
    const script = word.getComponent('WordItem')
    script.init({
      parentParams: {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
        scale: 0.5
      },
      spriteParams: {
        spriteFrame: sprite
      },
      textParams: {
        label: '王',
        fontSize: 80,
        color: new cc.Color(0, 0, 0)
      },
      otherParams: {
        callback: () => {
          if (this.collisionManager.isCollisionAndRight()) {
            this.success(word)
          } else {
            this.error(script)
          }
        }
      }
    })
  },

  success(word) {
    cc.tween(word).to(0.5, { position: cc.v2(130, -8), scale: 0 }, { easing: 'fade' }).call(() => {
      word.active = false
      cc.audioEngine.play(this.successTip, false, 1)
      cc.director.loadScene(getReviewScene())
    }).start()
  },

  error(script) {
    script.backTween()
    cc.audioEngine.play(this.errorTip, false, 1)
  }
});
