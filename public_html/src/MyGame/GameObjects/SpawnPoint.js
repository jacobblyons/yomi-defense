class SpawnPoint extends GameObject {
  constructor(pos, id) {
    var rend = new Renderable();
    rend.setColor([0, 0, 1, 1]);
    rend.getXform().setSize(3, 3);
    super(rend);

    this.getXform().setPosition(pos.x, pos.y);
    this.id = id;
    RoundManager.instance.OnSpawnPointSelected.subscribe(this._onSpawnPointSelected.bind(this));
  }

  isIntersection(point) {
    return this.getBBox().containsPoint(point.x, point.y);
  }

  _onSpawnPointSelected() {
    if (RoundManager.instance.State.SelectedSpawnPoint !== this.id) return;
    this.getRenderable().setColor([1, 1, 0, 1]);
  }
}
