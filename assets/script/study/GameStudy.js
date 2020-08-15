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
    bigItem: {
      scale: 0.8,
      textFont: {
        position: cc.v2(0, 50)
      }
    }
  },
  {
    sprite: 'pic_zx_book',
    color: new cc.Color(255, 255, 255),
    position: cc.v2(0, 0),
    label: '',
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
    bigItem: {
      scale: 0.7,
      textFont: {
        position: cc.v2(0, 0)
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
    cc.resources.load('texture/study', cc.SpriteAtlas, (error, atlas) => {
      const item = ITEMS[Math.floor(Math.random() * ITEMS.length)]
      this.initItems(item, atlas)
      this.initBigItem(item, atlas)
    })
  },

  initItems(item, atlas) {
    const top = this.parent.height * 0.05
    const everyScreenClient = parseInt(this.parent.width / ROW_WORD_COUNT)
    let index = 0
    const sprite = atlas.getSpriteFrame(item.sprite)
    this.refresh().forEach(it => {
      cc.resources.load('prefab/study_word_item', cc.Prefab, (error, asset) => {
        const prefab = cc.instantiate(asset)
        this.parent.addChild(prefab)
        const script = prefab.getComponent('StudyWordItem')
        const mod = index % ROW_WORD_COUNT
        const div = parseInt(index / ROW_WORD_COUNT)
        const size = { width: DEFAULT_ITEM_WIDTH, height: DEFAULT_ITEM_WIDTH / (sprite.getRect().width / sprite.getRect().height) }
        const x = everyScreenClient / 2 + mod * everyScreenClient - (this.parent.width / 2)
        const y = (this.parent.height / 2) - div * (size.height + VERTICAL_SPACE) - size.height - top
        const position = new cc.v2(x, y)
        script.init({
          sprite,
          position,
          size,
          textFont: {
            label: it,
            color: item.color,
            position: item.position
          },
          clickCallBack: (text) => {
            this.bigWord.refresh({
              textFont: {
                label: text
              }
            })
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
    const list = ['阳', '春', '三', '月', '花', '好']
    const set = new Set()
    while (set.size < 6) {
      set.add(list[Math.floor(Math.random() * 6)])
    }
    return set
  },

  onDestroy() {
    cc.resources.releaseAll()
  }
});
