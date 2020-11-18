const Base = require("../utils/Base");
const { levelDataModel, getLevelScene } = require("../utils/globals");

cc.Class({
  extends: Base,

  properties: {
    wordItem1: cc.Node,
    wordItem2: cc.Node,
    targetText1: cc.Node,
    targetText2: cc.Node
  },

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    cc.director.getCollisionManager().enabledDebugDraw = true
    this.bootStart()
    console.log(levelDataModel._dataList)
  },

  init() {
    levelDataModel.initItem()
    this.initWordItem(this.wordItem1)
    this.initWordItem(this.wordItem2)
    this.setConfig()
  },

  getType() {
    return 5
  },

  getDataModel() {
    return levelDataModel
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
      other.node.tempState = 0
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
      this.scheduleOnce(() => {
        cc.director.loadScene(this.getNextScene())
      }, 1)
    }
  },

  doErrorAction(tempNode) {
    levelDataModel.setErrorState(this.sceneItem)
    tempNode.rawInfo.state = 2
  },

  getNextScene() {
    return getLevelScene()
  },

  onDestroy() {
    this.animal.off(cc.Node.EventType.TOUCH_END, this.animalTouchEnd, this)
    this.wordItem1.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
    this.wordItem2.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
  }
});
