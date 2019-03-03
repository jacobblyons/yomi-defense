class Waypoint extends GameObject {
  constructor(pos) {
    var rend = new Renderable();
    rend.setColor([1, 1, 1, 1]);
    super(rend);
    this.pos = pos;
    this.rotateDelta = 5;

    this.getXform().setXPos(pos.x);
    this.getXform().setYPos(pos.y);
  }

  update() {
    this.getXform().incRotationByDegree(this.rotateDelta);
  }
}
