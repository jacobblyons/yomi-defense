class EndPoint extends GameObject {
  constructor(pos, id) {
    var rend = new Renderable();
    rend.setColor([1, 0, 0, 1]);
    rend.getXform().setSize(3, 3);
    super(rend);

    this.id = id;
    this.getXform().setPosition(pos.x, pos.y);
    RoundManager.instance.OnEndPointSelected.subscribe(this._onEndPointSelected.bind(this));
  }

  isIntersection(point) {
    return this.getBBox().containsPoint(point.x, point.y);
  }

  _onEndPointSelected() {
    if (RoundManager.instance.State.SelectedEndPoint !== this.id) return;
    this.getRenderable().setColor([1, 1, 0, 1]);
  }
}
