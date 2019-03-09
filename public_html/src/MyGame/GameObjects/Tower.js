class Tower extends GameObject {
  constructor(pos, enemySet,texture) {
    var rend = new SpriteRenderable(texture);
    //rend.setColor([0, 0, 0, 1]);
    super(rend);
    this.towerType = Math.floor(Math.random()*3);
    if(this.towerType === 0){
        rend.setElementPixelPositions(728,818,1792,2048);
        this.getXform().setSize(3,6);
        this.range = 10;
        this.fireRate = 300;
    }
    if(this.towerType === 1){
        rend.setElementPixelPositions(959,1117,1792,2048);
        this.getXform().setSize(3,6);
        this.range = 20;
        this.fireRate = 800;
    }
    if(this.towerType === 2){
        rend.setElementPixelPositions(600,728,1908,2048);
        this.getXform().setSize(3,6);
        this.range = 40;
        this.fireRate = 1200;
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
    this.canSacrifice = false;
  }

  update() {
    super.update();
    if (GameManager.instance.State.RoundState.Turn === Turn.RunningWave) {
      if (Date.now() - this.lastTime > this.fireRate && this.enemySet.size() > 0) {
          if(this.checkRange()){
              this._shoot(this.pos);
          }  
      }
    }
    this.projectileSet.update();
    this.checkCollision();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.X)) {
        if(this.canSacrifice &&(GameManager.instance.State.RoundState.Turn === Turn.RunningWave))
            this._sacrifice();
    }
    if (this.enemySet.length !== 0 && this.canShoot&&(GameManager.instance.State.RoundState.Turn === Turn.RunningWave)){
        this.canSacrifice = true;
    }
    this.mParticles.update();
  }
  _shoot = function(pos){
    if(this.canShoot){
        var target = this._getTarget();
        //var targetPos = new Vector2(target.getXform().getPosition()[0], target.getXform().getPosition()[1]);
        this.projectileSet.addToSet(new TowerProjectile(target, pos,this.towerType));
        this.lastTime = Date.now();
    }
  }
  _sacrifice(){
    for (var i = 0 ; i < this.sacShots ;i++){
        var ppos = this.pos;
        ppos.x += Math.random()*-2;
        ppos.y += Math.random()*-2;        
        this._shoot(this.pos);
        for (var i = 0; i < 10; i++){
            var p = this.createSKParticle(this.getXform().getXPos(),this.getXform().getYPos());
            this.mParticles.addToSet(p);
        }
        this.getXform().setSize(0.01,0.01);
        this.canShoot = false;
        this.canSacrifice = false;
    }
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

  checkCollision() {
    for (var i = 0; i < this.projectileSet.size(); i++) {
      for (var j = 0; j < this.enemySet.size(); j++) {
        if (this.projectileSet
            .getObjectAt(i)
            .getBBox()
            .boundCollideStatus(this.enemySet.getObjectAt(j).getBBox()))                  
        {
          this.projectileSet.removeFromSet(this.projectileSet.getObjectAt(i));

          var isDead = this.enemySet.getObjectAt(j).hit();
          if (isDead) {
            this.enemySet.removeFromSet(this.enemySet.getObjectAt(j));
            RoundManager.instance.enemyKilled();
          }
        }
      }
    }
  }
  
  checkRange(){
      for (var e = 0; e < this.enemySet.size(); e++) {
        var _enemy = this.enemySet.getObjectAt(e);
        var eX = _enemy.getXform().getXPos();
        var eY = _enemy.getXform().getYPos();
        var dX = this.getXform().getXPos() - eX;
        var dY = this.getXform().getYPos() - eY;
        var dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (dist < this.range) {
          //var _enemyColor = _enemy.getRenderable();
          //_enemyColor.setColor([0.1, 0.7, 0.7, 1]);
          return true;
        }
      }
  }
  
    createSKParticle(atX,atY){
      	var life = 120;
	var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);	
        //p.getRenderable().setColor([1, 1, 1, 1]);
	// size of the particle	
	p.getXform().setSize(10, 10);
        p.getXform().incRotationByDegree(Math.random()*90-180);
        var px = p.getParticle();
        var rx = Math.random()*15 - 7.5;
        var ry = Math.random()*15 - 7.5;
        var rax = Math.random()*15 - 7.5;
        var ray = Math.random()*15 - 7.5;
        px.setAcceleration([rax,ray]);
        px.setVelocity([rx,ry]);        
    
	// size delta
	p.setSizeDelta(0.98);
	return p;
    }
}
