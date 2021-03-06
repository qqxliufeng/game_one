const Base = require("../utils/Base")
const { WORD_ITEM_WIDTH, baseDataModel, getGameScene, getApplyScene } = require("../utils/globals")

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
    },
    fingerStartOffset: {
      width: 80,
      height: 500
    },
    fingerEndOffset: {
      width: 80,
      height: 300
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
    },
    fingerStartOffset: {
      width: -100,
      height: 600
    },
    fingerEndOffset: {
      width: -100,
      height: 400
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
    },
    fingerStartOffset: {
      width: 50,
      height: 450
    },
    fingerEndOffset: {
      width: 50,
      height: 250
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
    },
    fingerStartOffset: {
      width: 0,
      height: 400
    },
    fingerEndOffset: {
      width: 0,
      height: 250
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
    },
    fingerStartOffset: {
      width: -150,
      height: 500
    },
    fingerEndOffset: {
      width: -150,
      height: 350
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
    },
    fingerStartOffset: {
      width: -50,
      height: 500
    },
    fingerEndOffset: {
      width: -50,
      height: 300
    }
  }
]

function getItemName() {
  return GAME_ITEM_LIST[Math.floor(Math.random() * GAME_ITEM_LIST.length)]
}

cc.Class({
  extends: Base,

  getType() {
    return 3
  },

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    this.itemInfo = getItemName()
    cc.resources.preload('texture/game/pic_chg_' + this.itemInfo.animalName + '_1', cc.spriteFrame)
    cc.resources.preload('texture/game/pic_chg_' + this.itemInfo.animalName + '_2', cc.spriteFrame)
    cc.resources.load('texture/game/bg_chg_' + this.itemInfo.bg, cc.SpriteFrame, (error, spriteFrame) => {
      this.parent.getComponent(cc.Sprite).spriteFrame = spriteFrame
      this.bootStart()
    })
  },

  init() {
    this.initAnimal()
  },

  getDataModel() {
    return baseDataModel
  },

  initAnimal() {
    cc.resources.load('texture/game/pic_chg_' + this.itemInfo.animalName + '_1', cc.SpriteFrame, (error, spriteFrame) => {
      this.animalSpriteOne = spriteFrame
      cc.resources.load('texture/game/pic_chg_' + this.itemInfo.animalName + '_2', cc.SpriteFrame, (e1, spriteFrame2) => {
        this.animalSpriteTwo = spriteFrame2
        cc.resources.load('prefab/game_animal_item', cc.Prefab, (e2, assets) => {
          this.animal = cc.instantiate(assets)
          this.parent.addChild(this.animal)
          // 初始化点击播放声音事件
          const path = this.getAudioPath().href
          this.animal.on(cc.Node.EventType.TOUCH_END, () => {
            playRemoteAudio(audioAddress + path)
          }, this)
          this.animal.scale = this.itemInfo.animalOption.scale
          this.animal.x = this.itemInfo.animalOption.x ? this.parent.x - this.parent.width * this.itemInfo.animalOption.x : 0
          this.animal.y = this.itemInfo.animalOption.y ? this.parent.y + this.parent.height * this.itemInfo.animalOption.y : 0
          this.animal.getComponent(cc.Sprite).spriteFrame = spriteFrame
          this.animation = this.animal.getComponent(cc.Animation)
          this.collisionManager = this.animal.getComponent('CollideListener')
          if (this.animalSpriteTwo) {
            //初始化动画效果
            const clip = cc.AnimationClip.createWithSpriteFrames([this.animalSpriteOne, this.animalSpriteTwo], 10)
            clip.name = 'animal_run'
            this.animation.addClip(clip)
            // const animationState = this.animation.play(clip.name)
            // animationState.repeatCount = 4
            //初始化碰撞组件
            const boxCollider = this.animal.addComponent(cc.BoxCollider)
            boxCollider.offset = cc.v2(this.animal.width * this.itemInfo.animalOption.boxCollider.offsetX, this.animal.height * this.itemInfo.animalOption.boxCollider.offsetY)
            boxCollider.size = cc.size(boxCollider.size.width * this.itemInfo.animalOption.boxCollider.width, boxCollider.size.height * this.itemInfo.animalOption.boxCollider.height)
          }
          this.initFood()
        })
      })
    })
  },


  initFood() {
    cc.resources.load('texture/game/pic_chg_' + this.itemInfo.foodName, cc.SpriteFrame, (error, sprite) => {
      const wordTextList = this.randomText(this.sceneItem.loreObject.list)
      for (let i = 0; i < 2; i++) {
        cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
          const width = WORD_ITEM_WIDTH
          const height = parseInt(WORD_ITEM_WIDTH * sprite.getRect().height / sprite.getRect().width)
          this.scheduleOnce(() => {
            const x = i % 2 === 0 ? (this.parent.x + this.parent.width / 2) - sprite.getRect().width / 2 : (this.parent.x - this.parent.width / 2) + sprite.getRect().width / 2
            const y = (this.parent.y - this.parent.height / 2) + sprite.getRect().height / 3 * 2
            this.initPrefab(cc.instantiate(assets), { x, y, width, height }, sprite, wordTextList[i])
            if (i === 1) {
              const box = this.animal.getComponent(cc.BoxCollider)
              const desPosition = box.offset
              this.initAudioFinger({
                parentObject: this.parent,
                audioObject: this.animal,
                startOffset: this.itemInfo.fingerStartOffset,
                endOffset: this.itemInfo.fingerEndOffset,
                nextStart: { x, y },
                nextEnd: {
                  x: desPosition.x * this.animal.scaleX + this.animal.position.x,
                  y: desPosition.y * this.animal.scaleY + this.animal.position.y
                }
              })
            }
          })
        })
      }
    })
  },

  initPrefab(word, position, sprite, textObj) {
    word.text = textObj.text
    word.zIndex = 1
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
        label: textObj.text,
        fontSize: 80,
        color: this.itemInfo.color,
        x: this.itemInfo.font.x || 0,
        y: this.itemInfo.font.y || 0
      },
      otherParams: {
        callback: () => {
          const { isCollided, other } = this.collisionManager.isCollisionAndRight()
          if (isCollided) {
            if (other.node.text === this.corroctItem.text) {
              this.playSuccessTip(word)
              this.doSuccessAction()
            } else {
              this.playErrorTip(script)
              this.doErrorAction(script)
            }
          } else {
            this.doErrorAction(script)
          }
        }
      }
    })
  },

  getNextScene() {
    return getGameScene()
  },

  successDialogCallback() {
    cc.director.loadScene(getApplyScene())
  },
});
