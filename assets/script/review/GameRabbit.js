const { reviewDataModel } = require('../utils/globals');
const BaseClass = require('./BaseClass');

const SPRITE_NAME = 'texture/pic_wg_megu'

cc.Class({
  extends: BaseClass,

  getSpriteName() {
    return SPRITE_NAME
  },

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
