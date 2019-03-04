class Waypoint extends GameObject {
  constructor(pos) {
    var rend = new Renderable();
    rend.setColor([1, 1, 1, 1]);
    super(rend);
    this.pos = pos;
    this.rotateDelta = 5;

    var rend2 = new Renderable();
    rend2.setColor([0, 1, 1, 1]);
    this.oppositeSpinning = new GameObject(rend2);
    this.oppositeSpinning.getXform().setXPos(pos.x);
    this.oppositeSpinning.getXform().setYPos(pos.y);
    this.oppositeSpinning.getXform().setSize(0.95, 0.95);

    this.getXform().setXPos(pos.x);
    this.getXform().setYPos(pos.y);
  }

  update() {
    this.getXform().incRotationByDegree(this.rotateDelta);
    this.oppositeSpinning.getXform().incRotationByDegree(-this.rotateDelta);
  }

  draw(cam) {
    super.draw(cam);
    this.oppositeSpinning.draw(cam);
  }
}
