
cc.Class({
  extends: cc.Component,

  properties: {
    parent: cc.Node
  },

  onLoad() {
    getLoading().then((loadingController) => { this.loadingController = loadingController })
  }
});
