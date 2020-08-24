const { WORD_ITEM_WIDTH, getReviewScene } = require("../utils/globals");

const PRE_FAB_NAME = 'prefab/word_item'
const SPRITE_NAME = 'texture/pic_wg_xiaoyu'

cc.Class({
  extends: cc.Component,

  properties: {
    parent: {
      type: cc.Node,
      default: null
    },
    animal: {
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
    cc.resources.load(SPRITE_NAME, cc.SpriteFrame, (error, sprite) => {
      const width = WORD_ITEM_WIDTH
      const height = parseInt(WORD_ITEM_WIDTH * sprite.getRect().height / sprite.getRect().width)
      cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
        this.initPrefab(cc.instantiate(assets), {
          x: (this.node.x - this.parent.width / 2) + sprite.getRect().width / 2,
          y: (this.node.y - this.parent.height / 2) + sprite.getRect().height / 2,
          width,
          height
        }, sprite)
      })
      cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
        this.initPrefab(cc.instantiate(assets), {
          x: (this.node.x + this.parent.width / 2) - sprite.getRect().width / 2,
          y: (this.node.y - this.parent.height / 2) + sprite.getRect().height / 2,
          width,
          height
        }, sprite)
      })
    })
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
          if (this.animal.getComponent('CollideListener').canEat()) {
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
