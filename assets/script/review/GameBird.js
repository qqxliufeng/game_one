const BaseClass = require('../utils/BaseClass')

const SPRITE_NAME = 'texture/pic_wg_canbaobao'

cc.Class({
  extends: BaseClass,

  onLoad() {
    this.initWordItem(SPRITE_NAME)
  },

  initPrefab(word, position, sprite) {
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
        label: '王',
        fontSize: 80,
        color: new cc.Color(0, 0, 0),
        x: 70,
        y: -20
      },
      otherParams: {
        callback: () => {
          if (this.collisionManager.isCollisionAndRight()) {
            this.success(word)
          } else {
            this.error(script)
          }
        }
      }
    })
  }
});
