const { getReviewScene } = require("./utils/globals");

cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node
  },

  onLoad() {
    // getLoading().then((loadingController) => { this.loadingController = loadingController })
    this.scheduleOnce(_ => {
      cc.director.loadScene(getReviewScene())
    }, 5)
  }
});
