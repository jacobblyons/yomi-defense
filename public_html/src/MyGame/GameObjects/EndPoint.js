class EndPoint extends GameObject {
  constructor(pos) {
    var rend = new Renderable();
    rend.setColor([1, 0, 0, 1]);
    rend.getXform().setSize(3, 3);
    super(rend);
    this.pos = pos;
    this.getXform().setPosition(pos.x, pos.y);
  }
}
