const GameLevelBase = require('./GameLevelBase')

cc.Class({
  extends: GameLevelBase,

  onLoad() {
    this.initWordItem(this.wordItem1)
    this.initWordItem(this.wordItem2)
  }
});
