
cc.Class({
  extends: cc.Component,

  properties: {

  },

  onCollisionEnter(other, self) {
    if (other.isCollided) {
      return
    }
    other.isCollided = true
    this.isCollided = true
  },
  onCollisionStay(other, self) {
    this.isCollided = true
    other.isCollided = true
  },
  onCollisionExit(other, self) {
    this.isCollided = false
    other.isCollided = false
  },

  canEat() {
    return this.isCollided
  }

});
