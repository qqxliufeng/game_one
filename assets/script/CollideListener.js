
cc.Class({
  extends: cc.Component,

  properties: {

  },

  onCollisionEnter(other, self) {
    console.log('enter')
    this.isCollided = true
  },
  onCollisionStay(other, self) {
    this.isCollided = true
  },
  onCollisionExit(other, self) {
    this.isCollided = false
  },

  canEat() {
    return this.isCollided
  }

});
