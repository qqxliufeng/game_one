const WORD_ITEM_WIDTH = 100
const REVIEW_GAME_SCENES = ['game_rabbit', 'game_bear', 'game_bird', 'game_dog', 'game_cat']
const LEVEL_GAME_SCENES = ['game_level_bear', 'game_level_boat', 'game_level_car', 'game_level_draw', 'game_level_train', 'game_level_windmills']
const WORD_PRE_FAB_NAME = 'prefab/word_item'

/**
 * 获得一个复习的游戏场景
 */
function getReviewScene() {
  // return REVIEW_GAME_SCENES[Math.floor(Math.random() * REVIEW_GAME_SCENES.length)]
  return 'game_cat'
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
  }
}