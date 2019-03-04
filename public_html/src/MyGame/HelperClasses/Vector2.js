class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getNormalized() {
    var mag = this.getMagnitude();
    return new Vector2(this.x / mag, this.y / mag);
  }

  getMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  getDistance(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2), Math.pow(other.y - this.y, 2));
  }
}
