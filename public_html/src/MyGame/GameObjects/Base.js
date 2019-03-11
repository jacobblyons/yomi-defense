class Base extends GameObject {
  constructor(pos, id) {
    var rend = new LightRenderable("assets/SpriteSheet.png");
    rend.setElementPixelPositions(1342, 1760, 1282, 1792);
    rend.getXform().setSize(3.5, 4);
    super(rend);
    this.gm = GameManager.instance;
    this.pos = pos;
    this.id = id;
    this.isPlayerOneBase = this.id === BaseID.P1.One || this.id === BaseID.P1.Two || this.id === BaseID.P1.Three;
    this.p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    this._setColor();
    this.getXform().setPosition(pos.x, pos.y);
    RoundManager.instance.OnSpawnPointSelected.subscribe(this._onSpawnBaseSelected.bind(this));
    RoundManager.instance.OnEndPointSelected.subscribe(this._onEndBaseSelected.bind(this));
    RoundManager.instance.OnWaveStart.subscribe(this._showSelected.bind(this));
    RoundManager.instance.OnRoundEnd.subscribe(this._cleanup.bind(this));
  }

  isIntersection(point) {
    return this.getBBox().containsPoint(point.x, point.y);
  }

  _onSpawnBaseSelected() {
    if (
      (this.isPlayerOneBase && this.p1Role === PlayerRole.Waving) ||
      (!this.isPlayerOneBase && this.p1Role === PlayerRole.Vaping)
    ) {
      //this.getRenderable().setColor([1, 1, 0, 1]); //highlight
      //setTimeout(this._setColor.bind(this), 100);
    }
  }

  _onEndBaseSelected() {
    if (
      (this.isPlayerOneBase && this.p1Role === PlayerRole.Vaping) ||
      (!this.isPlayerOneBase && this.p1Role === PlayerRole.Waving)
    ) {
      //this.getRenderable().setColor([1, 1, 0, 1]); //highlight
      //setTimeout(this._setColor.bind(this), 100);
    }
  }

  _setColor() {
    //this.getRenderable().setColor(this.isPlayerOneBase ? [0, 0, 1, 1] : [1, 0, 0, 1]);
  }

  _showSelected() {
    if (RoundManager.instance.State.SelectedSpawnBase !== this.id && RoundManager.instance.State.SelectedEndBase !== this.id)
      return;
    //this.getRenderable().setColor([1, 1, 0, 1]);
  }

  _cleanup() {
    this._setColor();
  }
}
