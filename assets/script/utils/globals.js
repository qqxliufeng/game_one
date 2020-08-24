const WORD_ITEM_WIDTH = 100
const REVIEW_GAME_SCENES = ['game_rabbit', 'game_bear', 'game_bird', 'game_dog', 'game_cat']
const WORD_PRE_FAB_NAME = 'prefab/word_item'

console.log(WORD_PRE_FAB_NAME)

function getReviewScene() {
  return REVIEW_GAME_SCENES[Math.floor(Math.random() * REVIEW_GAME_SCENES.length)]
}
module.exports = {
  WORD_PRE_FAB_NAME,
  WORD_ITEM_WIDTH,
  getReviewScene,
  getSpriteSize(sprite, width = WORD_ITEM_WIDTH) {
    return { width, height: parseInt(width * sprite.getRect().height / sprite.getRect().width) }
  }
}