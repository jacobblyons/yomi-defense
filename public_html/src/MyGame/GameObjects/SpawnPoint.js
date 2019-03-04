class SpawnPoint extends GameObject {
  constructor(pos) {
    var rend = new Renderable();
    rend.setColor([0, 0, 1, 1]);
    rend.getXform().setSize(3, 3);
    super(rend);
    this.getXform().setPosition(pos.x, pos.y);
  }
}
