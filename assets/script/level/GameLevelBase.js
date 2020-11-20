const Base = require("../utils/Base");
const { levelDataModel, getLevelScene, getReviewScene } = require("../utils/globals");

cc.Class({
  extends: Base,

  properties: {
    wordItem1: cc.Node,
    wordItem2: cc.Node,
    targetText1: cc.Node,
    targetText2: cc.Node,
    typeName: cc.String
  },

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    cc.director.getCollisionManager().enabledDebugDraw = true
    this.bootStart()
  },

  init() {
    levelDataModel.initItem()
    this.initWordItem(this.wordItem1)
    this.initWordItem(this.wordItem2)
    this.setConfig()
    const startOffset = {
      width: 150,
      height: -150
    }
    const endOffset = {
      width: 0,
      height: 0
    }
    const nextStart = this.wordItem1.getPosition()
    const nextEnd = this.targetText1.getPosition()
    switch (this.typeName) {
      case 'bear':
        endOffset.width = 50
        endOffset.height = -50
        break
      case 'boat':
        endOffset.width = 50
        endOffset.height = -50
        break
      case 'car':
        startOffset.width = 0
        startOffset.height = -300
        endOffset.width = -100
        endOffset.height = -100
        nextEnd.x = nextEnd.x - 20
        nextEnd.y = nextEnd.y + 120
        break
      case 'draw':
        startOffset.width = 200
        startOffset.height = -300
        endOffset.width = 50
        endOffset.height = -50
        break
      case 'train':
        startOffset.width = 200
        startOffset.height = -300
        endOffset.width = -200
        endOffset.height = -50
        nextEnd.x = nextEnd.x - 20
        nextEnd.y = nextEnd.y + 300
        break
      case 'windmills':
        endOffset.width = 50
        endOffset.height = -50
        break
    }
    this.initAudioFinger({
      parentObject: this.parent,
      audioObject: this.animal,
      startOffset,
      endOffset,
      nextStart,
      nextEnd
    })
  },

  getType() {
    return 5
  },

  getDataModel() {
    return levelDataModel
  },

  initOriginalData(it) {
    return {
      loreObject: it.loreObject,
      loreId: it.id,
      indexOf: it.index_of,
      type: 5
    }
  },

  initWordItem(wordItem) {
    this.animal.on(cc.Node.EventType.TOUCH_END, this.animalTouchEnd, this)
    wordItem.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    wordItem.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
    wordItem.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
  },

  setConfig() {
    this.wordItem1.rawInfo = {
      position: this.wordItem1.getPosition(),
      scale: this.wordItem1.scale,
      ...this.sceneItem.bottomTextItems[0]
    }
    this.wordItem1.getChildByName('text').getComponent(cc.Label).string = this.wordItem1.rawInfo.textObj.text
    this.wordItem2.rawInfo = {
      position: this.wordItem2.getPosition(),
      scale: this.wordItem2.scale,
      ...this.sceneItem.bottomTextItems[1]
    }
    this.wordItem2.getChildByName('text').getComponent(cc.Label).string = this.wordItem2.rawInfo.textObj.text
    this.targetText1.tempIndex = 1
    this.targetText2.tempIndex = 2
    // 0 没有答 1 正确 2 错误
    this.targetText1.tempState = 0
    this.targetText2.tempState = 0
  },

  touchMove(e) {
    e.target.setPosition(e.target.x + e.getDeltaX(), e.target.y + e.getDeltaY())
    e.target.scale = Math.min(e.target.rawInfo.scale, Math.max(0.3, 1 - cc.v2(e.target.x, e.target.y).sub(cc.v2(e.target.rawInfo.position.x, e.target.rawInfo.position.y)).len() / 500))
  },

  animalTouchEnd() {
    if (this.sceneItem) {
      playRemoteAudio(audioAddress + this.sceneItem.loreObject.list[0].href)
    }
  },

  touchEnd(e) {
    const { isCollided, other } = e.target.getComponent('CollideListener').isCollisionAndRight()
    if (isCollided) {
      if (other.node.tempIndex === e.target.rawInfo.index) {
        other.node.tempState = 1
        if (this.targetText1.tempState !== 1) {
          other.node.tempState = 0
          cc.tween(e.target).to(1, { position: e.target.rawInfo.position, scale: e.target.rawInfo.scale }, { easing: 'elasticOut' }).start()
          return
        }
        this.playSuccessTip(e.target)
        this.doSuccessAction(e.target)
      } else {
        other.node.tempState = 2
        this.playErrorTip()
        this.doErrorAction(e.target)
        cc.tween(e.target).to(1, { position: e.target.rawInfo.position, scale: e.target.rawInfo.scale }, { easing: 'elasticOut' }).start()
      }
    } else {
      other && (other.node.tempState = 0)
      cc.tween(e.target).to(1, { position: e.target.rawInfo.position, scale: e.target.rawInfo.scale }, { easing: 'elasticOut' }).start()
    }
  },

  doSuccessAction(tempNode) {
    if (this.targetText1.tempState === 1) {
      const label = this.targetText1.childrenCount === 1 ? this.targetText1.getChildByName('text').getComponent(cc.Label) : this.targetText1.getComponent(cc.Label)
      if (!label.string) {
        label.string = tempNode.rawInfo.textObj.text
      }
    }
    if (this.targetText2.tempState === 1) {
      const label2 = this.targetText2.childrenCount === 1 ? this.targetText2.getChildByName('text').getComponent(cc.Label) : this.targetText2.getComponent(cc.Label)
      label2.string = tempNode.rawInfo.textObj.text
    }
    if (this.targetText1.tempState === 1 && this.targetText2.tempState === 1) {
      cc.audioEngine.play(this.successTip, false, 1)
      levelDataModel.setCorrectState(this.sceneItem)
      const temp = levelDataModel.getItemModel()
      if (temp) {
        this.scheduleOnce(() => {
          cc.director.loadScene(this.getNextScene())
        }, 1)
      } else {
        getLoading().then((controller) => {
          post({
            url: record,
            data: levelDataModel.generatorReport()
          }).then(res => {
            controller.close()
            if (res.code === 200) {
              getSuccessDialog().then(controller => {
                controller.init({
                  spriteFrame: this.spriteFrame,
                  nextButtonTip: '继续学习下一课',
                  successTip: '本节课程已经全部学习',
                  callback: () => {
                    controller.node.parent.active = false
                    this.successDialogCallback && this.successDialogCallback(controller)
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
    }
  },

  doErrorAction(tempNode) {
    levelDataModel.setErrorState(this.sceneItem)
    tempNode.rawInfo.state = 2
  },

  getNextScene() {
    return getLevelScene()
  },

  successDialogCallback() {
    cc.director.loadScene(getReviewScene())
  },

  onDestroy() {
    this.animal.off(cc.Node.EventType.TOUCH_END, this.animalTouchEnd, this)
    this.wordItem1.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    this.wordItem2.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
  }
});
