const BaseClass = require('../utils/BaseClass')

const SPRITE_NAME = 'texture/pic_wg_megu'

cc.Class({
  extends: BaseClass,

  onLoad() {
    // this.animal.on(cc.Node.EventType.TOUCH_END, () => {
    //   cc.assetManager.loadRemote('http://192.168.1.104:7456/app/editor/static/img/make.mp3', (error, asset) => {
    //     cc.audioEngine.playEffect(asset)
    //   })
    // }, this)
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
        y: -50
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
  },

  success(word) {
    word.active = false
    cc.audioEngine.play(this.successTip, false, 1)
    const animation = this.animal.getComponent(cc.Animation)
    animation.on('finished', () => {
      // cc.director.loadScene(getReviewScene())
    }, this);
    const animationState = animation.play()
    animationState.repeatCount = 4
  },

  error(script) {
    script.backTween()
    cc.audioEngine.play(this.errorTip, false, 1)
  }
});
