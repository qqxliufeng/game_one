const { WORD_ITEM_WIDTH } = require("../utils/globals")

const PRE_FAB_NAME = 'prefab/word_item'

const GAME_ITEM_LIST = [
  // {
  //   animalName: 'rabbit',
  //   foodName: 'carrot',
  //   bg: 'four',
  //   color: new cc.Color(0, 0, 0),
  //   animalOption: {
  //     scale: 0.8
  //   }
  // },
  // {
  //   animalName: 'dog',
  //   foodName: 'bone',
  //   bg: 'one',
  //   color: new cc.Color(0, 0, 0),
  //   animalOption: {
  //     scale: 0.8
  //   }
  // },
  {
    animalName: 'monkey',
    foodName: 'banana',
    bg: 'two',
    color: new cc.Color(0, 0, 0),
    animalOption: {
      scale: 0.7,
      x: 0.3,
      y: 0.12
    }
  },
  // {
  //   animalName: 'mouse',
  //   foodName: 'rice',
  //   bg: 'three',
  //   color: new cc.Color(0, 0, 0),
  //   animalOption: {
  //     scale: 0.7,
  //     x: 0.3,
  //     y: 0.12
  //   }
  // },
  // {
  //   animalName: 'sheep',
  //   foodName: 'grass',
  //   bg: 'one',
  //   color: new cc.Color(255, 255, 255),
  //   animalOption: {
  //     scale: 0.8
  //   }
  // },
  // {
  //   animalName: 'bear',
  //   foodName: 'pot',
  //   bg: 'four',
  //   color: new cc.Color(255, 255, 255),
  //   animalOption: {
  //     scale: 0.6
  //   }
  // }
]

function getItemName() {
  return GAME_ITEM_LIST[Math.floor(Math.random() * GAME_ITEM_LIST.length)]
}

cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node
  },

  onLoad() {
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
          const animalItem = cc.instantiate(assets)
          this.parent.addChild(animalItem)
          animalItem.scale = this.itemInfo.animalOption.scale
          animalItem.x = this.itemInfo.animalOption.x ? this.parent.x - this.parent.width * this.itemInfo.animalOption.x : 0
          animalItem.y = this.itemInfo.animalOption.x ? this.parent.y + this.parent.height * this.itemInfo.animalOption.y : 0
          animalItem.getComponent(cc.Sprite).spriteFrame = spriteFrame
          const animation = animalItem.getComponent(cc.Animation)
          if (this.animalSpriteTwo) {
            const clip = cc.AnimationClip.createWithSpriteFrames([this.animalSpriteOne, this.animalSpriteTwo], 10)
            clip.name = 'animal_run'
            clip.wrapMode = cc.WrapMode.Loop
            animation.addClip(clip)
            animation.play(clip.name)
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
        x: 0,
        y: -20
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
});
