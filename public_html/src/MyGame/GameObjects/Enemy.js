class Enemy extends GameObject {
  constructor() {
    var rend = new Renderable();
    rend.setColor([1, 0, 0, 1]);
    super(rend);
  }

  update() {
    this.moveTowards(new Vector2(50, 50), 0.2);
  }

  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    var vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());

    vectorTowards = vectorTowards.getNormalized();

    transform.incXPosBy(vectorTowards.x * dist);
    transform.incYPosBy(vectorTowards.y * dist);
  }
}
