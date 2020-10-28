
cc.Class({
  extends: cc.Component,

  onCollisionEnter(other, self) {
    this.other = other
    this.self = self
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

  isCollisionAndRight() {
    return this.isCollided && !!this.other && !!this.self
  }

});
