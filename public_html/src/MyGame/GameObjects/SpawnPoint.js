class SpawnPoint extends GameObject {
  constructor(pos, id) {
    var rend = new SpriteRenderable("assets/SpriteSheet.png");
    //rend.setColor([0, 0, 1, 1]);
    super(rend);    
    rend.setElementPixelPositions(1342,1760,1282,1792);
    rend.getXform().setSize(5, 7);
    this.pos = pos;
    this.getXform().setPosition(pos.x, pos.y);
    this.id = id;
    RoundManager.instance.OnSpawnPointSelected.subscribe(this._onSpawnPointSelected.bind(this));
    RoundManager.instance.OnWaveStart.subscribe(this._showSelected.bind(this));
    RoundManager.instance.OnRoundEnd.subscribe(this._cleanup.bind(this));
  }

  isIntersection(point) {
    return this.getBBox().containsPoint(point.x, point.y);
  }

  _onSpawnPointSelected() {
    //this.getRenderable().setColor([1, 1, 0, 1]);
    //setTimeout(() => this.getRenderable().setColor([0, 0, 1, 1]), 100);
  }
  _showSelected() {
    if (RoundManager.instance.State.SelectedSpawnPoint !== this.id) return;
    //this.getRenderable().setColor([1, 1, 0, 1]);
  }

  _cleanup() {
    //this.getRenderable().setColor([0, 0, 1, 1]);
  }
}
