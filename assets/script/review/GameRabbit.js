const { WORD_ITEM_WIDTH, getReviewScene } = require("../utils/globals");

const PRE_FAB_NAME = 'prefab/word_item'
const SPRITE_NAME = 'texture/pic_wg_megu'

cc.Class({
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

  onLoad() {
    cc.director.getCollisionManager().enabled = true
    cc.director.getCollisionManager().enabledDebugDraw = true
    // wx.config({
    //   debug: true,  // 打开输出开关
    //   appId: 'wxf8b4f85f3a794e77',
    //   timestamp: 1459418306,
    //   nonceStr: 'KTCr5MF8AGZu1sPN',
    //   signature: '1023f689b4351e8195366f6c78b3182ec297385c',
    //   jsApiList: [
    //     'checkJsApi',
    //     'onMenuShareTimeline'
    //   ]
    // })
    // wx.ready((res) => {
    //   cc.audioEngine.play(this.errorTip, false, 1)
    // })
    this.fingerTipNode = this.parent.getChildByName('finger_tip')
    this.fingerTipNode.active = false
    this.animal.on(cc.Node.EventType.TOUCH_END, () => {
      cc.assetManager.loadRemote('http://192.168.1.104:7456/app/editor/static/img/make.mp3', (error, asset) => {
        console.log(error)
        cc.audioEngine.playEffect(asset)
      })
    }, this)
    cc.resources.load(SPRITE_NAME, cc.SpriteFrame, (error, sprite) => {
      this.spriteFrame = sprite
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
    this.fingerTipNode.position = cc.v2(x, y)
    this.fingerTipNode.zIndex = 1
    this.fingerTipNode.active = true
    const box = this.animal.getComponent(cc.BoxCollider)
    const desPosition = box.offset
    cc.tween(this.fingerTipNode)
      .to(0.8, { position: cc.v2(desPosition.x + box.size.width / 2, desPosition.y) })
      .to(0, { position: cc.v2(x, y) })
      .repeatForever()
      .start()
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
          if (this.animal.getComponent('CollideListener').canEat()) {
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
      cc.director.loadScene(getReviewScene())
    }, this);
    const animationState = animation.play()
    animationState.repeatCount = 4
  },

  error(script) {
    script.backTween()
    cc.audioEngine.play(this.errorTip, false, 1)
  }
});
