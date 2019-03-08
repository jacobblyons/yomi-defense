class EndPoint extends GameObject {
  constructor(pos, id) {
    var rend = new SpriteRenderable("assets/SpriteSheet.png");
    //rend.setColor([0, 0, 1, 1]);
    super(rend);    
    rend.setElementPixelPositions(1342,1760,1282,1792);
    rend.getXform().setSize(5, 7);
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
    //this.getRenderable().setColor([1, 1, 0, 1]);
    //setTimeout(() => this.getRenderable().setColor([1, 0, 0, 1]), 100);
  }

  _showSelected() {
    //if (RoundManager.instance.State.SelectedEndPoint !== this.id) return;
    //this.getRenderable().setColor([1, 1, 0, 1]);
  }

  _cleanup() {
    //this.getRenderable().setColor([1, 0, 0, 1]);
  }
}
