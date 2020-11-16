const { WORD_ITEM_WIDTH, baseDataModel, getGameScene } = require("../utils/globals")
const PRE_FAB_NAME = 'prefab/word_item'

module.exports = cc.Class({
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

  getAudioPath() {
    this.corroctItem = null
    this.wordItem.loreObject.list.forEach(it => {
      if (it.text === this.wordItem.loreObject.text) {
        this.corroctItem = it
      }
    })
    return this.corroctItem
  },

  initFinger(x, y) {
    if (!this.parent || !this.animal) return
    cc.resources.load('prefab/finger_tip', cc.Prefab, (error, asset) => {
      if (error) return
      const fingerTip = cc.instantiate(asset)
      this.parent.addChild(fingerTip)
      const fingerController = fingerTip.getComponent('finger')
      const box = this.animal.getComponent(cc.BoxCollider)
      const desPosition = box.offset
      fingerController.init({
        startPosition: cc.v2(x, y),
        endPosition: cc.v2(desPosition.x * this.animal.scaleX + this.animal.position.x, desPosition.y * this.animal.scaleY + this.animal.position.y - fingerTip.height / 2)
      })
      this.parent.on(cc.Node.EventType.TOUCH_START, () => {
        fingerTip.active === true && (fingerTip.active = false)
      })
    })
  },

  randomText(srcList) {
    const tempList = []
    while (tempList.length < srcList.length) {
      const tempItem = srcList[Math.floor(Math.random() * srcList.length)]
      if (tempList.find(it => it === tempItem)) {
        continue
      } else {
        tempList.push(tempItem)
      }
    }
    return tempList
  },

  playSuccessTip(word) {
    word.active = false
    cc.audioEngine.play(this.successTip, false, 1)
  },

  doSuccessAction() {
    baseDataModel.setCorrectState(this.wordItem)
    const animation = this.animal.getComponent(cc.Animation)
    if (animation) {
      animation.on('finished', () => {
        const item = baseDataModel.getItemModel()
        if (item) {
          this.scheduleOnce(() => {
            cc.director.loadScene(getGameScene())
          }, 1)
        } else {
          getLoading().then((controller) => {
            post({
              url: record,
              data: baseDataModel.generatorReport()
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
      }, this);
      const animationState = animation.play('animal_run')
      animationState.repeatCount = 4
    } else {
      this.scheduleOnce(() => {
        cc.director.loadScene(getGameScene())
      }, 1)
    }
  },

  playErrorTip() {
    cc.audioEngine.play(this.errorTip, false, 1)
  },

  doErrorAction(script) {
    baseDataModel.setErrorState(this.wordItem)
    script.backTween()
  }

})
