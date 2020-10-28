const { WORD_ITEM_WIDTH, getReviewScene } = require("./globals")
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

  initWordItem(spriteName) {
    cc.director.getCollisionManager().enabled = true
    this.collisionManager = this.animal.getComponent('CollideListener')
    cc.resources.load(spriteName, cc.SpriteFrame, (error, sprite) => {
      if (error) return
      const width = WORD_ITEM_WIDTH
      const height = parseInt(WORD_ITEM_WIDTH * sprite.getRect().height / sprite.getRect().width)
      const x1 = (this.node.x - this.parent.width / 2) + sprite.getRect().width / 2
      const y1 = (this.node.y - this.parent.height / 2) + sprite.getRect().height / 2
      cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
        this.initPrefab(cc.instantiate(assets), {
          x: x1,
          y: y1,
          width,
          height
        }, sprite)
      })
      this.initFinger(x1, y1)
      cc.resources.load(PRE_FAB_NAME, cc.Prefab, (error, assets) => {
        this.initPrefab(cc.instantiate(assets), {
          x: (this.node.x + this.parent.width / 2) - sprite.getRect().width / 2,
          y: (this.node.y - this.parent.height / 2) + sprite.getRect().height / 2,
          width,
          height
        }, sprite)
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
  }
})
