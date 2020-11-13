const WORD_ITEM_WIDTH = 100
const REVIEW_GAME_SCENES = ['game_rabbit', 'game_bear', 'game_bird', 'game_dog', 'game_cat']
const LEVEL_GAME_SCENES = ['game_level_bear', 'game_level_boat', 'game_level_car', 'game_level_draw', 'game_level_train', 'game_level_windmills']
const WORD_PRE_FAB_NAME = 'prefab/word_item'

/**
 * 获得一个复习的游戏场景
 */
function getReviewScene() {
  return REVIEW_GAME_SCENES[Math.floor(Math.random() * REVIEW_GAME_SCENES.length)]
}

/**
 * 获得一个闯关的游戏场景
 */
function getLevelScene() {
  return LEVEL_GAME_SCENES[Math.floor(Math.random() * LEVEL_GAME_SCENES.length)]
}

/**
 * 获得一个学习的游戏场景
 */
function getStudyScene() {
  return 'game_study'
}

/**
 * 获得一个运用的游戏场景
 */
function getApplyScene() {
  return 'game_apply'
}

/**
 * 获得一个游戏的游戏场景
 */
function getGameScene() {
  return 'game_game'
}

module.exports = {
  WORD_PRE_FAB_NAME,
  WORD_ITEM_WIDTH,
  getReviewScene,
  getLevelScene,
  getStudyScene,
  getApplyScene,
  getGameScene,
  getSpriteSize(sprite, width = WORD_ITEM_WIDTH) {
    return { width, height: parseInt(width * sprite.getRect().height / sprite.getRect().width) }
  },
  reviewDataModel: {
    _dataList: [],
    _tempItem: null,
    init(srcList) {
      this._dataList = srcList
      if (this._dataList) {
        this._dataList.forEach(it => {
          // 0 没有学习 1 正确 2 错误
          it.state = 0
          // 错误的次数
          it.errorCount = 0
          // 正确的次数
          it.correctCount = 0
        })
      } else {
        this._tempItem = null
      }
    },
    getItemModel() {
      if (this._dataList) {
        // 获取还没有学过的 字
        this._tempItem = this._dataList.find(it => it.state === 0)
        if (this._tempItem) {
          return this._tempItem
        }
        // 获取第一次正确的 字，但还没有开始第二次学习的字
        this._tempItem = this._dataList.find(it => it.state === 1 && it.correctCount === 1)
        if (this._tempItem) {
          return this._tempItem
        }
        // 获取错过的字，且没有再学习完成 N 次的字
        this._tempItem = this._dataList.find(it => it.errorCount !== 0)
        return this._tempItem
      }
    },
    setErrorState(tempItem) {
      // 只要出现错误的，就把状态设置成错误状态，并且把要复习的次数重新设置成 3
      if (tempItem) {
        tempItem.state = 2
        tempItem.errorCount = 3
      }
    },
    setCorrectState(tempItem) {
      if (tempItem) {
        switch (tempItem.state) {
          case 0:
            tempItem.state = 1
            tempItem.correctCount++
            break
          case 1:
            tempItem.correctCount++
            break
          case 2:
            tempItem.errorCount--
            break
        }
      }
    },
    /**
     * 生成学习记录报告
     */
    generatorReport() {

    }
  }
}