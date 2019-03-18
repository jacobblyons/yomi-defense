class Tower extends GameObject {
  constructor(pos, enemySet, texture) {
    var rend = new LightRenderable(texture);
    //rend.setColor([0, 0, 0, 1]);
    super(rend);
    this.towerType = Math.floor(Math.random() * 3);
    if (this.towerType === 0) {
      rend.setElementPixelPositions(728, 818, 1792, 2048);
      this.getXform().setSize(3, 6);
      this.range = 15;
      this.fireRate = 275;
    }
    if (this.towerType === 1) {
      rend.setElementPixelPositions(959, 1117, 1792, 2048);
      this.getXform().setSize(3, 6);
      this.range = 25;
      this.fireRate = 700;
    }
    if (this.towerType === 2) {
      rend.setElementPixelPositions(600, 728, 1908, 2048);
      this.getXform().setSize(3, 6);
      this.range = 40;
      this.fireRate = 1100;
    }
    this.gm = GameManager.instance;
    this.pos = pos;
    this.getXform().setXPos(pos.x);
    this.getXform().setYPos(pos.y);
    this.xform = this.getXform();
    this.lastTime = Date.now();
    this.projectileSet = new GameObjectSet();
    this.kParticleTexture = "assets/ParticleSystem/SK.png";
    this.mParticles = new ParticleGameObjectSet();
    this.enemySet = enemySet;
    this.canShoot = true;
    this.sacShots = 3;
    this.shotsTaken = 0;
    this.canSacrifice = false;
    this.mShake = new ShakePosition(1.5,3,1,60);
    this.mShakeFlag = false;
  }

  update() {
    super.update();
    if (GameManager.instance.State.RoundState.Turn === Turn.RunningWave) {
      if (Date.now() - this.lastTime > this.fireRate && this.enemySet.size() > 0) {
        if (this.checkRange()) {
          this._shoot(this.pos);
        }
      }
    }
    this.projectileSet.update();
    this.checkProjectileLife();
    this.checkCollision();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.X)) {
      if (this.canSacrifice && GameManager.instance.State.RoundState.Turn === Turn.RunningWave) this._sacrifice();
    }
    if (
      this.enemySet.length !== 0 &&
      this.canShoot &&
      this.shotsTaken === 0 &&
      GameManager.instance.State.RoundState.Turn === Turn.RunningWave
    ) {
      this.canSacrifice = true;
    }
    this.mParticles.update();
    if (this.canSacrifice){
        if(this.mShakeFlag){
            if(this.mShake.shakeDone()){
                this.mShakeFlag = false;
                this.mShake = new ShakePosition(1.5, 3, 1, 60);            
            }
            else
            {
            var SR = this.mShake.getShakeResults();
            this.getXform().setSize(3-SR[0], 6-SR[1]);
            }
        }
    }
  }
  
  _shoot = function(pos) {
    if (this.canShoot) {
      this.mShakeFlag = true;
      this.shotsTaken++;
      var target = this._getTarget();      
      this.projectileSet.addToSet(new TowerProjectile(target, pos, this.towerType));
      this.getRenderable().setColor([1, 1, 1, 0.6]);
      setTimeout(
        (() => {
          this.getRenderable().setColor([1, 0, 0, 0.6]);
        }).bind(this),
        25
      );
      setTimeout(
        (() => {
          this.getRenderable().setColor([1, 1, 1, 0]);
        }).bind(this),
        75
      );
      this.lastTime = Date.now();      
    }
  }

  _sacrifice() {
    this.range = 45;
    for (var i = 0; i < this.sacShots; i++) {
      var rpos = this.pos;
      rpos.x += Math.random()*1-2;
      rpos.y += Math.random()*1-2;
      this._shoot(rpos);
    }
    for (var j = 0; j < 7; j++) {
      var p = this.createSKParticle(this.getXform().getXPos(), this.getXform().getYPos());
      this.mParticles.addToSet(p);
    }
    this.getXform().setSize(0.01, 0.01);
    this.canShoot = false;
    this.canSacrifice = false;
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
    this.mParticles.draw(cam);
  }
  checkProjectileLife(){
      for (var i = 0; i < this.projectileSet.size(); i++) {
          var projectile = this.projectileSet.getObjectAt(i);
          if(projectile !== null){
              if (projectile.lifespan < 1){
                  this.projectileSet.removeFromSet(projectile);
              }else{
                  projectile.lifespan--;
              }
          }
      }
  }
  checkCollision() {
    for (var i = 0; i < this.projectileSet.size(); i++) {
      for (var j = 0; j < this.enemySet.size(); j++) {
        if (this.enemySet.getObjectAt(j) !== null) {
          if (
            this.projectileSet
              .getObjectAt(i)
              .getBBox()
              .boundCollideStatus(this.enemySet.getObjectAt(j).getBBox())
          ) {
            this.projectileSet.removeFromSet(this.projectileSet.getObjectAt(i));            
            var isDead = this.enemySet.getObjectAt(j).hit();
            if (isDead) {
              this.enemySet.removeFromSet(this.enemySet.getObjectAt(j));
              GameManager.instance.mGameScene.getCamera().shake(-1, -1, 30, 10);
              RoundManager.instance.enemyKilled();
            }
          }
        }
      }
    }
  }

  checkRange() {
    for (var e = 0; e < this.enemySet.size(); e++) {
      var _enemy = this.enemySet.getObjectAt(e);
      var eX = _enemy.getXform().getXPos();
      var eY = _enemy.getXform().getYPos();
      var dX = this.getXform().getXPos() - eX;
      var dY = this.getXform().getYPos() - eY;
      var dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      if (dist < this.range) {
        return true;
      }
    }
  }

  createSKParticle(atX, atY) {
    var life = 120;
    var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);    
    // size of the particle
    p.getXform().setSize(10, 10);
    p.getXform().incRotationByDegree(Math.random() * 90 - 180);
    var px = p.getParticle();
    var rx = Math.random() * 15 - 7.5;
    var ry = Math.random() * 15 - 7.5;
    var rax = Math.random() * 15 - 7.5;
    var ray = Math.random() * 15 - 7.5;
    px.setAcceleration([rax, ray]);
    px.setVelocity([rx, ry]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
}
