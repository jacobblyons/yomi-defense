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
      if (Date.now() - this.lastTime > GameManager.instance.State.GameState.TowerFireRate && this.enemySet.size() > 0) {
        var target = new Vector2(
          this._getTarget()
            .getXform()
            .getPosition()[0],
          this._getTarget()
            .getXform()
            .getPosition()[1]
        );
        this.projectileSet.addToSet(new TowerProjectile(target, this.pos));
        this.lastTime = Date.now();
      }
    }
    this.projectileSet.update();
  }

  _getTarget() {
    return this.enemySet.mSet.reduce((acc, cur) => {
      var curDist = this.pos.getDistance(new Vector2(cur.getXform().getPosition()[0], cur.getXform().getPosition()[1]));
      var accDist = this.pos.getDistance(new Vector2(acc.getXform().getPosition()[0], acc.getXform().getPosition()[1]));
      return curDist < accDist ? cur : acc;
    }, this.enemySet.getObjectAt(0));
  }

  draw(cam) {
    super.draw(cam);
    this.projectileSet.draw(cam);
  }
}
