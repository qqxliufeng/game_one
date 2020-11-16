const { WORD_ITEM_WIDTH, getReviewScene } = require("../utils/globals")
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

  onLoad() {
    getLoading().then((controller) => {
      post({
        url: findKnowDetail,
        data: {
          type: 2
        }
      }).then(res => {
        controller.close()
        if (res.code === 200) {
          this.dataModel = res.data
          this.dataModel.loreObject.list = this.randomText(this.dataModel.loreObject.list)
          const path = this.getAudioPath().href
          this.animal.on(cc.Node.EventType.TOUCH_END, () => {
            playRemoteAudio(audioAddress + path)
          }, this)
          this.initWordItem(this.getSpriteName(), this.dataModel.loreObject.list[0].text, this.dataModel.loreObject.list[1].text)
        } else {
          showToast(res.msg)
        }
      }).catch(error => {
        controller.close()
        showToast(error.message)
      })
    })
  },

  getAudioPath() {
    this.corroctItem = null
    this.dataModel.loreObject.list.forEach(it => {
      if (it.text === this.dataModel.loreObject.text) {
        this.corroctItem = it
      }
    })
    return this.corroctItem
  },

  initWordItem(spriteName, leftText = '', rightText = '') {
    cc.director.getCollisionManager().enabled = true
    this.collisionManager = this.animal.getComponent('CollideListener')
    cc.resources.load(spriteName, cc.SpriteFrame, (error, sprite) => {
      if (error) return
      const width = WORD_ITEM_WIDTH
      const height = parseInt(WORD_ITEM_WIDTH * sprite.getRect().height / sprite.getRect().width)
      this.scheduleOnce(() => {
        const x1 = (this.node.x - this.parent.width / 2) + sprite.getRect().width / 2
        const y1 = (this.node.y - this.parent.height / 2) + Math.max(sprite.getRect().height / 2, 110)
        cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
          this.initPrefab(cc.instantiate(assets), {
            x: x1,
            y: y1,
            width,
            height
          }, sprite, leftText)
        })
        this.initFinger(x1, y1)
        cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
          this.initPrefab(cc.instantiate(assets), {
            x: (this.node.x + this.parent.width / 2) - sprite.getRect().width / 2,
            y: y1,
            width,
            height
          }, sprite, rightText)
        })
      })
    })
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

  callback(word, script) {
    const { isCollided, other } = this.collisionManager.isCollisionAndRight()
    if (isCollided) {
      if (other.node.text === this.corroctItem.text) {
        this.playSuccessTip(word)
        this.uploadRecord(true)
      } else {
        this.uploadRecord(false)
        this.doErrorAction(script)
        this.playErrorTip(script)
      }
    } else {
      this.doErrorAction(script)
    }
  },

  uploadRecord(isRight) {
    post({
      url: record,
      data: {
        operatorType: 1,
        result: isRight ? 1 : 2,
        loreId: this.dataModel.id
      }
    }).then(res => {
      if (res.code === 200) {
        if (isRight) {
          this.doSuccessAction()
        }
      }
    }).catch(error => {
      console.log(error)
    })
  },

  playSuccessTip(word) {
    word.active = false
    cc.audioEngine.play(this.successTip, false, 1)
  },

  doSuccessAction() {
    const animation = this.animal.getComponent(cc.Animation)
    if (animation) {
      animation.on('finished', () => {
        cc.director.loadScene(getReviewScene())
      }, this);
      const animationState = animation.play('animal_run')
      animationState.repeatCount = 4
    } else {
      this.scheduleOnce(() => {
        cc.director.loadScene(getReviewScene())
      }, 0.5)
    }
  },

  playErrorTip() {
    cc.audioEngine.play(this.errorTip, false, 1)
  },

  doErrorAction(script) {
    script.backTween()
  }

})
