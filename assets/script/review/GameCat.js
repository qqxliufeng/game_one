const BaseClass = require('../utils/BaseClass')

const SPRITE_NAME = 'texture/pic_wg_xiaoyu'

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
        color: new cc.Color(0, 0, 0)
      },
      otherParams: {
        callback: this.callback.bind(this, word, script)
      }
    })
  }
});
