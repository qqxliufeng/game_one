cc.Class({
  extends: cc.Component,

  properties: {
    mushroomOne: {
      type: cc.Node,
      default: null
    },
    mushroomTwo: {
      type: cc.Node,
      default: null
    },
    rabbit: {
      type: cc.Node,
      default: null
    },
    successClip: {
      type: cc.AudioClip,
      default: null
    },
    errorClip: {
      type: cc.AudioClip,
      default: null
    }
  },

  onLoad() {
    this.init()
    cc.director.getCollisionManager().enabled = true
    // cc.director.getCollisionManager().enabledDebugDraw = true
    this.setTouchEvent(this.mushroomOne, this.mushroomOne.getPosition())
    this.setTouchEvent(this.mushroomTwo, this.mushroomTwo.getPosition())
    this.rabbit.on(cc.Node.EventType.TOUCH_END, () => {
      this.rabbit.getComponent(cc.AudioSource).play()
    }, this)
  },

  init() {
    this.correctWord = '荣'
    this.errorWord = '耀'
    this.rabbit.getChildByName('word').getComponent(cc.Label).string = this.correctWord
    this.mushroomOne.getChildByName('word').getComponent(cc.Label).string = this.correctWord
    this.mushroomTwo.getChildByName('word').getComponent(cc.Label).string = this.errorWord
  },

  /**
   * 设置触摸监听事件
   * @param {*} node 
   * @param {*} defaultPosition 
   */
  setTouchEvent(node, defaultPosition) {
    node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
      node.setPosition(node.x + event.getDeltaX(), node.y + event.getDeltaY())
      node.scale = Math.min(0.7, Math.max(0.3, 1 - cc.v2(node.x, node.y).sub(cc.v2(defaultPosition.x, defaultPosition.y)).len() / 500))
    }, this)
    node.on(cc.Node.EventType.TOUCH_END, this.touchEndResult.bind(this, node, defaultPosition), this)
    node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndResult.bind(this, node, defaultPosition), this)
  },

  /**
   * 当触摸事件完成之后，首先会判断是不是在指定的区域中，如果在区域中，再判断单词是否正确
   * @param {*} node 
   * @param {*} defaultPosition 
   */
  touchEndResult(node, defaultPosition) {
    const canEat = this.rabbit.getComponent('CollideListener').canEat()
    if (canEat) {
      if (node.getChildByName('word').getComponent(cc.Label).string === this.correctWord) {
        const anim = this.rabbit.getComponent(cc.Animation)
        anim.play('rabbit').repeatCount = 3
        node.active = false
        cc.audioEngine.play(this.successClip, false, 1)
      } else {
        this.backTween(node, defaultPosition)
      }
    } else {
      this.backTween(node, defaultPosition)
    }
  },

  backTween(node, defaultPosition) {
    cc.audioEngine.play(this.errorClip, false, 1)
    cc.tween(node).to(1, { position: defaultPosition, scale: 0.7 }, { easing: 'elasticOut' }).start()
  },

  start() {

  },

  // update (dt) {},
});
