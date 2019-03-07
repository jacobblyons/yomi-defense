class EndPoint extends GameObject {
  constructor(pos, id) {
    var rend = new Renderable();
    rend.setColor([1, 0, 0, 1]);
    rend.getXform().setSize(3, 3);
    super(rend);
    this.pos = pos;
    this.id = id;
    this.getXform().setPosition(pos.x, pos.y);
    RoundManager.instance.OnEndPointSelected.subscribe(this._onEndPointSelected.bind(this));
    RoundManager.instance.OnWaveStart.subscribe(this._showSelected.bind(this));
    RoundManager.instance.OnRoundEnd.subscribe(this._cleanup.bind(this));
  }

  isIntersection(point) {
    return this.getBBox().containsPoint(point.x, point.y);
  }

  _onEndPointSelected() {
    this.getRenderable().setColor([1, 1, 0, 1]);
    setTimeout(() => this.getRenderable().setColor([1, 0, 0, 1]), 100);
  }

  _showSelected() {
    if (RoundManager.instance.State.SelectedEndPoint !== this.id) return;
    this.getRenderable().setColor([1, 1, 0, 1]);
  }

  _cleanup() {
    this.getRenderable().setColor([1, 0, 0, 1]);
  }
}
