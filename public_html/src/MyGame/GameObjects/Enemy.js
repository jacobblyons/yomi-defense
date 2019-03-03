class Enemy extends GameObject {
  constructor(rend) {
    super(rend);
  }

  update() {
    this.moveTowards(mouse, 0.2);
  }

  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    var vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());

    vectorTowards = vectorTowards.getNormalized();

    transform.incXPosBy(vectorTowards.x * dist);
    transform.incYPosBy(vectorTowards.y * dist);
  }
}
