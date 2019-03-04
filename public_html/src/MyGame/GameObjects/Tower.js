class Tower extends GameObject {
  constructor(pos, enemySet) {
    var rend = new Renderable();
    rend.setColor([0, 0, 0, 1]);
    super(rend);
    this.gm = GameManager.instance;
    this.pos = pos;
    this.rotateDelta = 5;
    this.range = 25;
    this.getXform().setXPos(pos.x);
    this.getXform().setYPos(pos.y);
    this.xform = this.getXform();
    this.lastTime = Date.now();
    this.projectileSet = new GameObjectSet();
    this.enemySet = enemySet;
  }

  update() {
    super.update();
    if (GameManager.instance.State.RoundState.Turn === Turn.RunningWave) {
      if (Date.now() - this.lastTime > GameManager.instance.State.GameState.TowerFireRate) {
        this.projectileSet.addToSet(new TowerProjectile(this._getTarget(), this.pos));
        this.lastTime = Date.now();
      }
    }
    this.projectileSet.update();
  }

  _getTarget() {
    return new Vector2(50, 50);
  }

  draw(cam) {
    super.draw(cam);
    this.projectileSet.draw(cam);
  }
}
