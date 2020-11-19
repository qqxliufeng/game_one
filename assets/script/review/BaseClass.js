const Base = require("../utils/Base")
const { WORD_ITEM_WIDTH, getReviewScene, baseDataModel, getStudyScene } = require("../utils/globals")
const PRE_FAB_NAME = 'prefab/word_item'

module.exports = cc.Class({
  extends: Base,

  onLoad() {
    this.bootStart()
  },

  getType() {
    return 1
  },

  init() {
    const wordText = this.randomText(this.sceneItem.loreObject.list)
    const path = this.getAudioPath().href
    this.animal.on(cc.Node.EventType.TOUCH_END, () => {
      playRemoteAudio(audioAddress + path)
    }, this)
    this.initWordItem(this.getSpriteName(), wordText[0].text, wordText[1].text)
  },

  getDataModel() {
    return baseDataModel
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

  getNextScene() {
    return getReviewScene()
  },

  successDialogCallback(controller) {
    cc.director.loadScene(getStudyScene())
  }
})
