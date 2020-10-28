const { WORD_ITEM_WIDTH } = require("../utils/globals")

const PRE_FAB_NAME = 'prefab/word_item'

const GAME_ITEM_LIST = [
  {
    animalName: 'rabbit',
    foodName: 'carrot',
    bg: 'four',
    color: new cc.Color(0, 0, 0),
    animalOption: {
      scale: 0.7,
      x: -0.1,
      y: 0.1,
      boxCollider: {
        offsetX: 0.15,
        offsetY: 0.12,
        width: 1.2,
        height: 1.2
      }
    },
    font: {
      x: 0,
      y: 0
    }
  },
  {
    animalName: 'dog',
    foodName: 'bone',
    bg: 'one',
    color: new cc.Color(0, 0, 0),
    animalOption: {
      scale: 0.8,
      boxCollider: {
        offsetX: -0.2,
        offsetY: 0.22,
        width: 1.2,
        height: 1.2
      }
    },
    font: {
      x: 0,
      y: 0
    }
  },
  {
    animalName: 'monkey',
    foodName: 'banana',
    bg: 'two',
    color: new cc.Color(0, 0, 0),
    animalOption: {
      scale: 0.7,
      x: 0.3,
      y: 0.12,
      boxCollider: {
        offsetX: 0.2,
        offsetY: 0.15,
        width: 1.15,
        height: 1.15
      }
    },
    font: {
      x: 40,
      y: -50
    }
  },
  {
    animalName: 'mouse',
    foodName: 'rice',
    bg: 'three',
    color: new cc.Color(0, 0, 0),
    animalOption: {
      scale: 0.7,
      x: 0.3,
      y: 0.12,
      boxCollider: {
        offsetX: 0.2,
        offsetY: 0,
        width: 2,
        height: 1.15
      }
    },
    font: {
      x: 0,
      y: -30
    }
  },
  {
    animalName: 'sheep',
    foodName: 'grass',
    bg: 'one',
    color: new cc.Color(255, 255, 255),
    animalOption: {
      scale: 0.8,
      boxCollider: {
        offsetX: -0.23,
        offsetY: 0.22,
        width: 1.2,
        height: 1.2
      }
    },
    font: {
      x: 0,
      y: -30
    }
  },
  {
    animalName: 'bear',
    foodName: 'pot',
    bg: 'four',
    color: new cc.Color(255, 255, 255),
    animalOption: {
      scale: 0.6,
      boxCollider: {
        offsetX: -0.15,
        offsetY: 0.22,
        width: 1.4,
        height: 1.4
      }
    },
    font: {
      x: 0,
      y: -30
    }
  }
]

function getItemName() {
  return GAME_ITEM_LIST[Math.floor(Math.random() * GAME_ITEM_LIST.length)]
}

cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node,
    successTip: cc.AudioClip,
    errorTip: cc.AudioClip
  },

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    // cc.director.getCollisionManager().enabledDebugDraw = true
    this.itemInfo = getItemName()
    cc.resources.preload('texture/game/pic_chg_' + this.itemInfo.animalName + '_1', cc.spriteFrame)
    cc.resources.preload('texture/game/pic_chg_' + this.itemInfo.animalName + '_2', cc.spriteFrame)
    cc.resources.load('texture/game/bg_chg_' + this.itemInfo.bg, cc.SpriteFrame, (error, spriteFrame) => {
      this.parent.getComponent(cc.Sprite).spriteFrame = spriteFrame
      this.initAnimal()
      this.initFood()
    })
  },

  initAnimal() {
    cc.resources.load('texture/game/pic_chg_' + this.itemInfo.animalName + '_1', cc.SpriteFrame, (error, spriteFrame) => {
      this.animalSpriteOne = spriteFrame
      cc.resources.load('texture/game/pic_chg_' + this.itemInfo.animalName + '_2', cc.SpriteFrame, (e1, spriteFrame2) => {
        this.animalSpriteTwo = spriteFrame2
        cc.resources.load('prefab/game_animal_item', cc.Prefab, (e2, assets) => {
          this.animalItem = cc.instantiate(assets)
          this.parent.addChild(this.animalItem)
          this.animalItem.scale = this.itemInfo.animalOption.scale
          this.animalItem.x = this.itemInfo.animalOption.x ? this.parent.x - this.parent.width * this.itemInfo.animalOption.x : 0
          this.animalItem.y = this.itemInfo.animalOption.y ? this.parent.y + this.parent.height * this.itemInfo.animalOption.y : 0
          this.animalItem.getComponent(cc.Sprite).spriteFrame = spriteFrame
          this.animation = this.animalItem.getComponent(cc.Animation)
          if (this.animalSpriteTwo) {
            //初始化动画效果
            const clip = cc.AnimationClip.createWithSpriteFrames([this.animalSpriteOne, this.animalSpriteTwo], 10)
            clip.name = 'animal_run'
            this.animation.addClip(clip)
            const animationState = this.animation.play(clip.name)
            animationState.repeatCount = 4
            //初始化碰撞组件
            const boxCollider = this.animalItem.addComponent(cc.BoxCollider)
            boxCollider.offset = cc.v2(this.animalItem.width * this.itemInfo.animalOption.boxCollider.offsetX, this.animalItem.height * this.itemInfo.animalOption.boxCollider.offsetY)
            boxCollider.size = cc.size(boxCollider.size.width * this.itemInfo.animalOption.boxCollider.width, boxCollider.size.height * this.itemInfo.animalOption.boxCollider.height)
          }
        })
      })
    })
  },


  initFood() {
    cc.resources.load('texture/game/pic_chg_' + this.itemInfo.foodName, cc.SpriteFrame, (error, sprite) => {
      for (let i = 0; i < 2; i++) {
        cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
          const width = WORD_ITEM_WIDTH
          const height = parseInt(WORD_ITEM_WIDTH * sprite.getRect().height / sprite.getRect().width)
          this.initPrefab(cc.instantiate(assets), {
            x: i % 2 === 0 ? (this.parent.x + this.parent.width / 2) - sprite.getRect().width / 2 : (this.parent.x - this.parent.width / 2) + sprite.getRect().width / 2,
            y: (this.parent.y - this.parent.height / 2) + sprite.getRect().height / 3 * 2,
            width,
            height
          }, sprite)
        })
      }
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
        color: this.itemInfo.color,
        x: this.itemInfo.font.x || 0,
        y: this.itemInfo.font.y || 0
      },
      otherParams: {
        callback: () => {
          // script.backTween()
          if (this.animalItem.getComponent('CollideListener').isCollisionAndRight()) {
            this.success(word)
          } else {
            this.error(script)
          }
        }
      }
    })
  },

  success(word) {
    cc.tween(word).to(0.5, { scale: 0 }, { easing: 'fade' }).call(() => {
      word.active = false
      cc.audioEngine.play(this.successTip, false, 1)
      const animationState = this.animation.play('animal_run')
      animationState.repeatCount = 4
    }).start()
  },

  error(script) {
    script.backTween()
    cc.audioEngine.play(this.errorTip, false, 1)
  }
});
