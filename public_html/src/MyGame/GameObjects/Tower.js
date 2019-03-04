class Tower extends GameObject {
  constructor(pos) {
    var rend = new Renderable();
    rend.setColor([0, 0, 0, 1]);
    super(rend);
    this.pos = pos;
    this.rotateDelta = 5;
    this.range = 25;
    this.getXform().setXPos(pos.x);
    this.getXform().setYPos(pos.y);
    this.xform = this.getXform();
    
  }

  update() {
  }
}
