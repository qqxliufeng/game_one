const { WORD_PRE_FAB_NAME, getSpriteSize } = require("../utils/globals")

const APPLY_GAME_ITEM_LIST = [
  {
    name: 'air',
    scale: 0.4,
    bg: 'air',
    font: {
      fontSize: 80,
      color: new cc.Color(0, 0, 0),
      x: -40,
      y: -10
    }
  },
  {
    name: 'apple',
    scale: 0.4,
    bg: 'apple',
    font: {
      fontSize: 80,
      color: new cc.Color(255, 255, 255),
      x: 0,
      y: -40
    }
  },
  {
    name: 'balloons',
    scale: 0.4,
    bg: 'air',
    font: {
      fontSize: 80,
      color: new cc.Color(255, 255, 255),
      x: -5,
      y: 80
    }
  },
  {
    name: 'fish',
    scale: 0.4,
    bg: 'fish',
    font: {
      fontSize: 80,
      color: new cc.Color(255, 255, 255),
      x: -20,
      y: 0
    }
  },
  {
    name: 'frog',
    scale: 0.5,
    bg: 'frog',
    font: {
      fontSize: 80,
      color: new cc.Color(0, 0, 0),
      x: 0,
      y: 0
    }
  },
  {
    name: 'flower',
    scale: 0.4,
    bg: 'flower',
    font: {
      fontSize: 80,
      color: new cc.Color(255, 255, 255),
      x: 0,
      y: 50
    }
  }
]

const TOP_ITEM_LINE_COUNT = 4

const BOTTOM_ITEM_LINE_COUNT = 2

const BOTTOM_ITEMS = []

function getItemName() {
  return APPLY_GAME_ITEM_LIST[Math.floor(Math.random() * APPLY_GAME_ITEM_LIST.length)]
}

cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node,
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
    cc.director.getCollisionManager().enabledDebugDraw = true
    getLoading().then((controller) => {
      post({
        url: findKnowDetail,
        data: {
          type: 4
        }
      }).then(res => {
        controller.close()
        baseDataModel.init(res.data.map(it => {
          return {
            loreObject: it.loreObject,
            loreId: it.id,
            type: 4
          }
        }))
        this.wordItem = baseDataModel.getItemModel()
        if (this.wordItem) {
          this.init()
        }
      }).catch(error => {
        controller.close()
        showToast(error.message)
      })
    })
    this.itemNameInfo = getItemName()
    cc.resources.load('texture/apply/pic_yy_bg_' + this.itemNameInfo.bg, cc.SpriteFrame, (error, spriteFrame) => {
      this.parent.getComponent(cc.Sprite).spriteFrame = spriteFrame
      this.initTopSprite()
      this.initBottomSprite()
    })
  },

  /**
   * 初始化顶部的精灵
   */
  initTopSprite() {
    const everyScreenWidth = this.parent.width / TOP_ITEM_LINE_COUNT
    for (let i = 0; i < TOP_ITEM_LINE_COUNT; i++) {
      cc.resources.load('prefab/apply_top_word_item', cc.Prefab, (error, assets) => {
        const wordItem = cc.instantiate(assets)
        cc.resources.load('texture/apply/pic_yy_' + this.itemNameInfo.name, cc.SpriteFrame, (error, spriteFrame) => {
          const size = getSpriteSize(spriteFrame, spriteFrame.getRect().width * this.itemNameInfo.scale)
          this.initPrefab(wordItem, {
            x: everyScreenWidth / 2 + everyScreenWidth * i - this.parent.width / 2,
            y: this.parent.y + this.parent.height / 2 - this.parent.height / 5,
            width: size.width,
            height: size.height,
            scale: this.itemNameInfo.scale
          }, spriteFrame, i === 3, 'TopWordItem')
        })
      })
    }
  },

  /**
   * 初始化底部的精灵
   */
  initBottomSprite() {
    const everyScreenWidth = this.parent.width / BOTTOM_ITEM_LINE_COUNT
    for (let i = 0; i < BOTTOM_ITEM_LINE_COUNT * 2; i++) {
      cc.resources.load(WORD_PRE_FAB_NAME, cc.Prefab, (error, assets) => {
        const wordItem = cc.instantiate(assets)
        cc.resources.load('texture/apply/pic_yy_' + this.itemNameInfo.name, cc.SpriteFrame, (error, spriteFrame) => {
          const size = getSpriteSize(spriteFrame, spriteFrame.getRect().width * this.itemNameInfo.scale)
          const div = parseInt(i / BOTTOM_ITEM_LINE_COUNT)
          const mod = i % BOTTOM_ITEM_LINE_COUNT
          this.initPrefab(wordItem, {
            x: everyScreenWidth / 2 + everyScreenWidth * mod - this.parent.width / 2,
            y: (this.parent.y - this.parent.height / 2 + this.parent.height / 5) + div * (size.height + 150),
            width: size.width,
            height: size.height,
            scale: this.itemNameInfo.scale * 1.5
          }, spriteFrame, true, 'WordItem')
        })
      })
    }
  },

  initPrefab(word, position, sprite, addCollider, scriptName) {
    this.parent.addChild(word)
    const script = word.getComponent(scriptName)
    script.init({
      parentParams: {
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
        scale: position.scale,
        addCollider
      },
      spriteParams: {
        spriteFrame: sprite
      },
      textParams: {
        label: this.itemNameInfo.font.label || '',
        fontSize: this.itemNameInfo.font.fontSize,
        color: this.itemNameInfo.font.color,
        x: this.itemNameInfo.font.x,
        y: this.itemNameInfo.font.y
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

  /**
   * 刷新界面
   */
  refresh() {
    // ['王', '者', '荣', '耀'].forEach((it, index) => {
    //   TOP_ITEMS[index].getComponent('WordItem').setText(it)
    // })
    cc.director.loadScene('game_apply')
  },

  playSuccessTip(word) {
    cc.audioEngine.play(this.successTip, false, 1)
  },

  playErrorTip() {
    cc.audioEngine.play(this.errorTip, false, 1)
  }


});
