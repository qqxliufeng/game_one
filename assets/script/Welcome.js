const { getReviewScene, getStudyScene, getGameScene, getApplyScene, getLevelScene } = require("./utils/globals");

cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node
  },

  onLoad() {
    // 默认的游戏类型是---study
    // 所有的游戏类型是：review(复习)、study(学习)、game(游戏)、apply(运用)、level(闯关)
    const urlParams = new URLSearchParams(location.search)
    console.log(window.location.search)
    const gameType = urlParams.get('type') || 'study'
    // let sceneName = ''
    // switch (gameType) {
    //   case 'review':
    //     sceneName = getReviewScene()
    //     break
    //   case 'study':
    //     sceneName = getStudyScene()
    //     break
    //   case 'game':
    //     sceneName = getGameScene()
    //     break
    //   case 'apply':
    //     sceneName = getApplyScene()
    //     break
    //   case 'level':
    //     sceneName = getLevelScene()
    //     break
    //   default:
    //     sceneName = getStudyScene()
    // }
    // cc.director.loadScene(sceneName)
  }
});
