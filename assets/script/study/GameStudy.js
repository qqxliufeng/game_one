// 每行的个数
const ROW_WORD_COUNT = 3

// 上下行之间的间距
const VERTICAL_SPACE = 80

// 默认条目的宽度
const DEFAULT_ITEM_WIDTH = 110

/**
 * 每个条目的数据结构
 */
const ITEMS = [
  {
    sprite: 'pic_zx_apple',
    color: new cc.Color(255, 255, 255),
    position: cc.v2(0, -10),
    label: '',
    type: 'apple',
    bigItem: {
      scale: 0.8,
      textFont: {
        position: cc.v2(0, -50)
      }
    }
  },
  {
    sprite: 'pic_zx_book',
    color: new cc.Color(255, 255, 255),
    position: cc.v2(0, 0),
    label: '',
    type: 'book',
    bigItem: {
      scale: 0.8,
      textFont: {
        position: cc.v2(0, 0)
      }
    }
  },
  {
    sprite: 'pic_zx_car',
    color: new cc.Color(255, 255, 255),
    position: cc.v2(0, 0),
    label: '',
    type: 'car',
    bigItem: {
      scale: 0.7,
      textFont: {
        position: cc.v2(0, 0)
      }
    }
  },
  {
    sprite: 'pic_zx_folwer',
    color: new cc.Color(255, 255, 255),
    position: cc.v2(0, 0),
    label: '',
    type: 'flower',
    bigItem: {
      scale: 0.6,
      textFont: {
        position: cc.v2(0, 0)
      }
    }
  },
  {
    sprite: 'pic_zx_mogu',
    color: new cc.Color(0, 0, 0),
    position: cc.v2(0, -20),
    label: '',
    type: 'mushroom',
    bigItem: {
      scale: 0.6,
      textFont: {
        position: cc.v2(0, -100)
      }
    }
  },
  {
    sprite: 'pic_zx_sun',
    color: new cc.Color(255, 255, 255),
    position: cc.v2(0, 0),
    label: '',
    type: 'sun',
    bigItem: {
      scale: 0.7,
      textFont: {
        position: cc.v2(0, 20)
      }
    }
  }
]

cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node,
    bigWord: cc.Component
  },


  onLoad() {
    getLoading().then((controller) => {
      post({
        url: findKnowDetail,
        data: {
          type: 2
        }
      }).then(res => {
        this.submitSuccess = false
        controller.close()
        if (res.code === 200) {
          this.dataModel = res.data
          cc.resources.load('texture/study', cc.SpriteAtlas, (error, atlas) => {
            const item = ITEMS[Math.floor(Math.random() * ITEMS.length)]
            this.initItems(item, atlas)
            this.initBigItem(item, atlas)
          })
        } else {
          showToast(res.msg)
        }
      }).catch(error => {
        controller.close()
        showToast(error.message)
      })
    })
  },

  initItems(item, atlas) {
    const top = this.parent.height * 0.05
    const everyScreenClient = parseInt(this.parent.width / ROW_WORD_COUNT)
    let index = 0
    const sprite = atlas.getSpriteFrame(item.sprite)
    this.tempListWord = this.refresh()
    this.tempListWord.forEach(it => {
      cc.resources.load('prefab/study_word_item', cc.Prefab, (error, asset) => {
        const prefab = cc.instantiate(asset)
        this.parent.addChild(prefab)
        const script = prefab.getComponent('StudyWordItem')
        const mod = index % ROW_WORD_COUNT
        const div = parseInt(index / ROW_WORD_COUNT)
        const size = {
          width: DEFAULT_ITEM_WIDTH,
          height: DEFAULT_ITEM_WIDTH / (sprite.getRect().width / sprite.getRect().height)
        }
        const x = everyScreenClient / 2 + mod * everyScreenClient - (this.parent.width / 2)
        const y = (this.parent.height / 2) - div * (size.height + VERTICAL_SPACE) - size.height - top
        const position = new cc.v2(x, y)
        script.init({
          sprite,
          position,
          size,
          textFont: {
            label: it.text,
            color: item.color,
            position: item.position
          },
          clickCallBack: (word) => {
            const tempItem = this.tempListWord.find(it => it.text === word)
            tempItem.status = 1
            playRemoteAudio(audioAddress + tempItem.href)
            this.bigWord.refresh({
              type: item.type,
              textFont: {
                label: tempItem.text
              }
            })
            const result = this.tempListWord.some(it => it.status === 0)
            if (!result) {
              if (!this.submitSuccess) {
                post({
                  url: record,
                  data: this.tempListWord.map(it => {
                    return {
                      loreId: it.loreId,
                      operatorType: 2,
                      result: 1
                    }
                  })
                }).then(res => {
                  this.submitSuccess = true
                }).catch(error => {
                  console.log(error)
                })
              }
              this.scheduleOnce(() => {
                getSuccessDialog().then(controller => {
                  controller.init({
                    callback: () => {
                      controller.node.parent.active = false
                    }
                  })
                })
              }, 4)
            }
          }
        })
        index++
      })
    })
  },

  initBigItem(item, atlas) {
    cc.resources.load('prefab/study_big_word', cc.Prefab, (error, asset) => {
      const prefab = cc.instantiate(asset)
      this.parent.addChild(prefab)
      this.bigWord = prefab.getComponent('StudyBigWord')
      this.bigWord.init({
        sprite: atlas.getSpriteFrame(item.sprite),
        position: cc.v2(0, -200),
        scale: item.bigItem.scale,
        textFont: {
          color: item.color,
          position: item.bigItem.textFont.position
        }
      })
    })
  },

  refresh() {
    return this.dataModel.map(it => {
      const item = it.loreObject.list[0]
      // 添加status属性，0代表没有点击，没有学习；1代表已经点击学习过了 
      item.loreId = it.id
      item.status = 0
      return item
    })
  },

  onDestroy() {
    cc.resources.releaseAll()
  }
});
