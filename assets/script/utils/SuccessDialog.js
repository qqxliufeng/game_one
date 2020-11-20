
cc.Class({
  extends: cc.Component,

  properties: {
    image: {
      type: cc.Sprite,
      default: null
    },
    tip: {
      type: cc.Label,
      default: null
    },
    nextButton: {
      type: cc.Button,
      default: null
    }
  },

  onLoad() {
    this.nextButton.node.on('click', this.callback, this)
  },

  init({ spriteFrame = null, successTip = '真棒，本关内容已全部学习完成', nextButtonTip = '开启下一关', callback = null }) {
    successTip && (this.tip.string = successTip)
    spriteFrame && (this.image.spriteFrame = spriteFrame)
    if (nextButtonTip) {
      const label = this.nextButton.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label)
      label.string = nextButtonTip
    }
    this.callback = callback
  },

  callback() {
    this.callback && this.callback()
  }

});
