const Base = require("../utils/Base")
const { WORD_PRE_FAB_NAME, getSpriteSize, applyDataModel, getApplyScene, getLevelScene } = require("../utils/globals")

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

const BOTTOM_ITEM_LINE_COUNT = 2

function getItemName() {
  return APPLY_GAME_ITEM_LIST[Math.floor(Math.random() * APPLY_GAME_ITEM_LIST.length)]
}

cc.Class({
  extends: Base,

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    this.itemNameInfo = getItemName()
    cc.resources.load('texture/apply/pic_yy_bg_' + this.itemNameInfo.bg, cc.SpriteFrame, (error, spriteFrame) => {
      this.parent.getComponent(cc.Sprite).spriteFrame = spriteFrame
      this.bootStart()
    })
  },

  init() {
    applyDataModel.initItem()
    this.initTopSprite()
    this.initBottomSprite()
  },

  getType() {
    return 4
  },

  getDataModel() {
    return applyDataModel
  },

  initOriginalData(it) {
    return {
      loreObject: it.loreObject,
      loreId: it.id,
      indexOf: it.index_of,
      type: 4
    }
  },

  /**
   * 初始化顶部的精灵
   */
  initTopSprite() {
    const count = this.sceneItem.topTextItems.length
    const everyScreenWidth = this.parent.width / count
    for (let i = 0; i < count; i++) {
      cc.resources.load('prefab/apply_top_word_item', cc.Prefab, (error, assets) => {
        const wordItem = cc.instantiate(assets)
        cc.resources.load('texture/apply/pic_yy_' + this.itemNameInfo.name, cc.SpriteFrame, (error, spriteFrame) => {
          const size = getSpriteSize(spriteFrame, spriteFrame.getRect().width * this.itemNameInfo.scale)
          const x = everyScreenWidth / 2 + everyScreenWidth * i - this.parent.width / 2
          const y = this.parent.y + this.parent.height / 2 - this.parent.height / 5
          if (i === (this.sceneItem.indexOf - 1)) {
            this.tempItem = wordItem
          }
          this.initPrefab(wordItem, this.sceneItem.topTextItems[i], {
            x,
            y,
            width: size.width,
            height: size.height,
            scale: this.itemNameInfo.scale
          }, spriteFrame, i === (this.sceneItem.indexOf - 1), 'TopWordItem')
        })
      })
    }
  },

  /**
   * 初始化底部的精灵
   */
  initBottomSprite() {
    const everyScreenWidth = this.parent.width / BOTTOM_ITEM_LINE_COUNT
    const tempArray = Array.from(this.sceneItem.bottomTextItems)
    for (let i = 0; i < tempArray.length; i++) {
      cc.resources.load(WORD_PRE_FAB_NAME, cc.Prefab, (error, assets) => {
        const wordItem = cc.instantiate(assets)
        cc.resources.load('texture/apply/pic_yy_' + this.itemNameInfo.name, cc.SpriteFrame, (error, spriteFrame) => {
          const size = getSpriteSize(spriteFrame, spriteFrame.getRect().width * this.itemNameInfo.scale)
          const div = parseInt(i / BOTTOM_ITEM_LINE_COUNT)
          const mod = i % BOTTOM_ITEM_LINE_COUNT
          const x = everyScreenWidth / 2 + everyScreenWidth * mod - this.parent.width / 2
          const y = (this.parent.y - this.parent.height / 2 + this.parent.height / 5) + div * (size.height + 150)
          this.initPrefab(wordItem, tempArray[i].text, {
            x,
            y,
            width: size.width,
            height: size.height,
            scale: this.itemNameInfo.scale * 1.5
          }, spriteFrame, true, 'WordItem')
          if (i === tempArray.length - 1) {
            this.scheduleOnce(() => {
              if (this.tempItem) {
                this.initAudioFinger({
                  parentObject: this.parent,
                  audioObject: this.tempItem,
                  startOffset: { width: 0, height: 200 },
                  endOffset: { width: 0, height: 100 },
                  nextStart: { x, y },
                  nextEnd: { x: this.tempItem.x + 50, y: this.tempItem.y - 50 }
                })
              }
            }, 0.5)
          }
        })
      })
    }
  },

  initPrefab(word, label, position, sprite, addCollider, scriptName) {
    if (addCollider && scriptName === 'TopWordItem') {
      this.collisionManager = word.getComponent('CollideListener')
    }
    word.text = label
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
        label: scriptName === 'WordItem' ? label : addCollider ? '' : label,
        fontSize: this.itemNameInfo.font.fontSize,
        color: this.itemNameInfo.font.color,
        x: this.itemNameInfo.font.x,
        y: this.itemNameInfo.font.y
      },
      otherParams: {
        callback: () => {
          const { isCollided, other } = this.collisionManager.isCollisionAndRight()
          if (isCollided) {
            if (other.node.text === this.sceneItem.loreObject.text) {
              this.playSuccessTip(word)
              const script = this.tempItem.getComponent('TopWordItem')
              script.setTextParams({
                label: this.sceneItem.loreObject.text,
                fontSize: this.itemNameInfo.font.fontSize,
                color: this.itemNameInfo.font.color,
                x: this.itemNameInfo.font.x,
                y: this.itemNameInfo.font.y
              })
              this.doSuccessAction()
            } else {
              this.playErrorTip(script)
              this.doErrorAction(script)
            }
          } else {
            this.doErrorAction(script)
          }
        },
        playAudio: () => {
          if (!addCollider) return
          const tmp = this.sceneItem.loreObject.list.find(it => it.text === this.sceneItem.loreObject.text)
          playRemoteAudio(audioAddress + tmp.href)
        }
      }
    })
  },

  uploadOrNext() {
    const item = applyDataModel.getItemModel()
    if (item) {
      this.scheduleOnce(() => {
        cc.director.loadScene(this.getNextScene())
      }, 1)
    } else {
      getLoading().then((controller) => {
        post({
          url: record,
          data: applyDataModel.generatorReport()
        }).then(res => {
          controller.close()
          if (res.code === 200) {
            getSuccessDialog().then(controller => {
              controller.init({
                callback: () => {
                  controller.node.parent.active = false
                }
              })
            })
          } else {
            showToast(res.msg)
          }
        }).catch(error => {
          controller.close()
          showToast(error.message)
        })
      })
    }
  },

  getNextScene() {
    return getApplyScene()
  },

  successDialogCallback() {
    cc.director.loadScene(getLevelScene())
  }
});
