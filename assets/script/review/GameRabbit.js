const { WORD_ITEM_WIDTH, getReviewScene } = require("../utils/globals");

const PRE_FAB_NAME = 'prefab/word_item'
const SPRITE_NAME = 'texture/pic_wg_megu'

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
    this.animal.on(cc.Node.EventType.TOUCH_END, () => {
      cc.assetManager.loadRemote('http://192.168.1.107:7456/app/editor/static/img/make.mp3', (error, asset) => {
        cc.audioEngine.play(asset)
      })
    }, this)
    cc.resources.load(SPRITE_NAME, cc.SpriteFrame, (error, sprite) => {
      this.spriteFrame = sprite
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
        color: new cc.Color(0, 0, 0),
        y: -50
      },
      otherParams: {
        callback: () => {
          if (this.animal.getComponent('CollideListener').canEat()) {
            this.success(word)
            cc.director.loadScene(getReviewScene())
          } else {
            this.error(script)
          }
        }
      }
    })
  },

  success(word) {
    word.active = false
    cc.audioEngine.play(this.successTip, false, 1)
    const animation = this.animal.getComponent(cc.Animation)
    const animationState = animation.play()
    animationState.repeatCount = 4
  },

  error(script) {
    script.backTween()
    cc.audioEngine.play(this.errorTip, false, 1)
  }
});
