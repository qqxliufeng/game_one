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
    },
    // 场景 数据 item
    sceneItem: {
      type: cc.Object,
      default: null
    },
    // 字 词 句 选项
    optionItem: {
      type: cc.Object,
      default: null
    },
    // 正确的选项
    corroctItem: {
      type: cc.Object,
      default: null
    }
  },

  /**
   * 初始化数据引擎
   */
  bootStart() {
    if (this.getDataModel().isNotEmpty()) {
      this.sceneItem = this.getDataModel().getItemModel()
      if (this.sceneItem) {
        this.init()
      }
    } else {
      getLoading().then((controller) => {
        post({
          url: findKnowDetail,
          data: {
            type: this.getType() || 1
          }
        }).then(res => {
          controller.close()
          if (res.code === 200) {
            const handleFunc = this.initOriginalData || (it => {
              return {
                loreObject: it.loreObject,
                loreId: it.id,
                type: this.getType() || 1
              }
            })
            this.getDataModel().init(res.data.map(handleFunc))
            this.sceneItem = this.getDataModel().getItemModel()
            if (this.sceneItem) {
              this.init()
            }
          } else {
            showToast(res.msg)
          }
        }).catch(error => {
          controller.close()
          showToast(error.message)
        })
      })
    }
  },

  /**
   * 获取要发音的地址
   */
  getAudioPath() {
    this.corroctItem = null
    this.sceneItem.loreObject.list.forEach(it => {
      if (it.text === this.sceneItem.loreObject.text) {
        this.corroctItem = it
      }
    })
    return this.corroctItem
  },

  /**
   * 随机排序单词、词语或者句子的位置
   * @param {*} srcList 源数据list
   */
  randomText(srcList) {
    const tempList = []
    while (tempList.length < srcList.length) {
      const tempItem = srcList[Math.floor(Math.random() * srcList.length)]
      if (tempList.find(it => it === tempItem)) {
        continue
      } else {
        tempList.push(tempItem)
      }
    }
    return tempList
  },

  /**
   * 初始化引导手指
   * @param {*} x 
   * @param {*} y 
   */
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
  },

  /**
   * 当操作选项单词之后的回调
   * @param {*} word 
   * @param {*} script 
   */
  callback(word, script) {
    const { isCollided, other } = this.collisionManager.isCollisionAndRight()
    if (isCollided) {
      if (other.node.text === this.corroctItem.text) {
        this.playSuccessTip(word)
        this.doSuccessAction()
      } else {
        this.doErrorAction(script)
        this.playErrorTip(script)
      }
    } else {
      this.doErrorAction(script)
    }
  },

  /**
   * 播放成功的音效
   */
  playSuccessTip(word) {
    word.active = false
    cc.audioEngine.play(this.successTip, false, 1)
  },

  /**
   * 执行操作成功的动作
   */
  doSuccessAction() {
    this.getDataModel().setCorrectState(this.sceneItem)
    const animation = this.animal ? this.animal.getComponent(cc.Animation) : null
    if (animation) {
      animation.on('finished', () => {
        this.uploadOrNext()
      }, this);
      const animationState = animation.play('animal_run')
      animationState.repeatCount = 4
    } else {
      this.uploadOrNext()
    }
  },

  playErrorTip() {
    cc.audioEngine.play(this.errorTip, false, 1)
  },

  doErrorAction(script) {
    this.getDataModel().setErrorState(this.sceneItem)
    script && script.backTween()
  },

  /**
   * 判断是否是提交报告还是继续学习
   */
  uploadOrNext() {
    const item = this.getDataModel().getItemModel()
    if (item) {
      this.scheduleOnce(() => {
        cc.director.loadScene(this.getNextScene())
      }, 1)
    } else {
      getLoading().then((controller) => {
        post({
          url: record,
          data: this.getDataModel().generatorReport()
        }).then(res => {
          controller.close()
          if (res.code === 200) {
            getSuccessDialog().then(controller => {
              controller.init({
                callback: () => {
                  controller.node.parent.active = false
                }
              })
            })
          } else {
            showToast(res.msg)
          }
        }).catch(error => {
          controller.close()
          showToast(error.message)
        })
      })
    }
  }
});
