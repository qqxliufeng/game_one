const { reviewDataModel, getReviewScene } = require('../utils/globals');
const BaseClass = require('./BaseClass');

const SPRITE_NAME = 'texture/pic_wg_megu'

cc.Class({
  extends: BaseClass,

  getSpriteName() {
    return SPRITE_NAME
  },

  // onLoad() {
  //   getSuccessDialog().then(controller => {
  //     controller.init({
  //       callback: () => {
  //         controller.node.parent.active = false
  //         console.log('点击了')
  //       }
  //     })
  //   })
  // },

  initPrefab(word, position, sprite, text) {
    word.text = text
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
        label: text,
        fontSize: 80,
        color: new cc.Color(0, 0, 0),
        y: -55
      },
      otherParams: {
        callback: this.callback.bind(this, word, script)
      }
    })
  }
});
