class Enemy extends GameObject {
  constructor(WS, sceneRef, texture) {
    var rend = new SpriteRenderable(texture);
    super(rend);
    var type = Math.floor(Math.random()*3);
    if(type === 0){
        rend.setElementPixelPositions(256,384,1926,2048);
        this.getXform().setSize(3,3);
        this.speed = 0.2;
        this.rotation = Math.random()*2;
        this.mHitPoints = 4;}
    if(type === 1){
        rend.setElementPixelPositions(1372,1629,1828,2048);
        this.getXform().setSize(4.5,3);
        this.speed = 0.35;
        this.rotation = Math.random()*3 + 2;
        this.mHitPoints = 3;}
    if(type === 2){
        rend.setElementPixelPositions(1629,1886,1802,2048);
        this.getXform().setSize(3,3);
        this.speed = 0.5;
        this.rotation = Math.random()*5;
        this.mHitPoints = 2;}
    this.kROParticleTexture = "assets/ParticleSystem/RO.png";
    this.kSKParticleTexture = "assets/ParticleSystem/SK.png";
    this.kCRParticleTexture = "assets/ParticleSystem/CR.png";
    this.kP1ParticleTexture = "assets/ParticleSystem/P1.png";
    this.kP2ParticleTexture = "assets/ParticleSystem/P2.png";
    this.kP3ParticleTexture = "assets/ParticleSystem/P3.png";
    this.kP4ParticleTexture = "assets/ParticleSystem/P4.png";
    this.mParticles = new ParticleGameObjectSet();
    
        //rend.setColor([0, 1, 0, 1]);
    this.gm = GameManager.instance;
    this.waypointsReached = 0;
    this.WaypointSet = WS;
    this.sceneRef = sceneRef;
    this.dead = false;
    this.maxSpeed = 1.4;
    this.incHP = false;
    this.p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
  }

  update() {
    this.getXform().incRotationByDegree(this.rotation);
    if (this.waypointsReached < RoundManager.instance.State.Waypoints.length) {
      var _waypt = RoundManager.instance.State.Waypoints[this.waypointsReached];
      this.moveTowards(_waypt, this.speed);
      var dX = this.getXform().getXPos() - _waypt.x;
      var dY = this.getXform().getYPos() - _waypt.y;
      var dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      if (dist < this.speed + 0.5) {
        //this.waypointsReached++;
        this.nextPoint();
        this.speedUp();
      }
    } else {
      var endBaseID = GameManager.instance.State.RoundState.SelectedEndBase;
      var _endPos =
        this.p1Role === PlayerRole.Vaping
          ? GameManager.instance.State.GameState.PlayerOne.Bases[endBaseID]
          : GameManager.instance.State.GameState.PlayerTwo.Bases[endBaseID];

      var endDX = this.getXform().getXPos() - _endPos.x;
      var endDY = this.getXform().getYPos() - _endPos.y;
      var endDist = Math.sqrt(Math.pow(endDX, 2) + Math.pow(endDY, 2));
      if (endDist < this.speed + 0.5) {        
        this.reachedGoal();
        this.sceneRef.enemyAtEndPoint(this);        
      } else {
        this.moveTowards(_endPos, this.speed);
      }
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.H)) {        
            this.hit();
    }
    this.mParticles.update();
  }
  draw(cam) {
    super.draw(cam);
    this.mParticles.draw(cam);
  }
  reachedGoal(){
      this.dead = true;      
  }
  speedUp(){
    if (this.speed < this.maxSpeed){
        this.speed += 0.175;
        this.speed.toFixed(5);
    }else{
            var p = this.createCRParticle(this.getXform().getXPos(),this.getXform().getYPos());
            this.mParticles.addToSet(p);
        }
    }
  
  nextPoint(){
    for (var i = 0; i < 7; i++){
        var p = this.createRParticle(this.getXform().getXPos(),this.getXform().getYPos());
        this.mParticles.addToSet(p);
        //this.mHitPoints++;
    }
      if(this.incHP)
          this.mHitPoints++;
      this.waypointsReached++;
      this.incHP = !this.incHP;
  }
  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    var vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());
    vectorTowards = vectorTowards.getNormalized();
    transform.incXPosBy(vectorTowards.x * dist);
    transform.incYPosBy(vectorTowards.y * dist);
  }

  hit() {
    this.mHitPoints--;
    for (var i = 0; i < 5; i++){
        var p = this.createSplashParticle(this.getXform().getXPos(),this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    if(this.mHitPoints < 0){
        var p = this.createSKParticle(this.getXform().getXPos(),this.getXform().getYPos());
        this.mParticles.addToSet(p);
        return true;
    }
//    switch (this.mHitPoints) {
//      case 2:
//        this.getRenderable().setColor([1, 0.65, 0, 1]);
//        break;
//      case 1:
//        this.getRenderable().setColor([1, 0, 0, 1]);
//        break;
//      case 0:
//        return true;
//        break;
//    }
  }

  _checkEndCollisions() {}

  createRParticle(atX,atY){
      	var life = 120;
	var p = new ParticleGameObject(this.kROParticleTexture, atX, atY, life);	
        //p.getRenderable().setColor([1, 1, 1, 1]);
	// size of the particle	
	p.getXform().setSize(3, 3);
        var px = p.getParticle();
        var rx = Math.random()*10 - 5;
        var ry = Math.random()*10 - 5;
        px.setVelocity([rx,ry]);

	// size delta
	p.setSizeDelta(0.98);
    
	return p;
    }
    createSKParticle(atX,atY){
      	var life = 150;
	var p = new ParticleGameObject(this.kSKParticleTexture, atX, atY, life);	
	// size of the particle	
	p.getXform().setSize(10, 15);
        var px = p.getParticle();        
        px.setVelocity([1,1]);
        px.setAcceleration([0,1]);
	// size delta
	p.setSizeDelta(0.98);    
	return p;
    }
      
    createCRParticle(atX,atY){
      	var life = 120;
	var p = new ParticleGameObject(this.kCRParticleTexture, atX, atY, life);	
	// size of the particle	
	p.getXform().setSize(10, 10);
        var px = p.getParticle();
        var rx = Math.random()*10 - 5;
        var ry = Math.random()*10 - 5;
        px.setVelocity([rx,ry]);
        px.setAcceleration([0,5]);
    
	// size delta
	p.setSizeDelta(0.98);    
	return p;
    }
    createSplashParticle(atX,atY){
      	var life = 120;
        var texture = null;
        var r = Math.floor(Math.random()*4);
        if (r === 0)
            texture = this.kP1ParticleTexture;
        if (r === 1)
            texture = this.kP2ParticleTexture;
        if (r === 2)
            texture = this.kP3ParticleTexture;
        if (r === 3)
            texture = this.kP4ParticleTexture;
	var p = new ParticleGameObject(this.kP4ParticleTexture, atX, atY, life);	
	// size of the particle	
	p.getXform().setSize(3, 3);        
        var px = p.getParticle();
        var rx = Math.random()*10 - 5;
        var ry = Math.random()*10 - 5;
        px.setVelocity([rx,ry]);
        var target = null;
        if (this.waypointsReached < RoundManager.instance.State.Waypoints.length){
            target = RoundManager.instance.State.Waypoints[this.waypointsReached];
        }else{
            var endBaseID = GameManager.instance.State.RoundState.SelectedEndBase;
            target = this.p1Role === PlayerRole.Vaping
          ? GameManager.instance.State.GameState.PlayerOne.Bases[endBaseID]
          : GameManager.instance.State.GameState.PlayerTwo.Bases[endBaseID];
        }
        var vectorTowards = new Vector2(target.x - this.getXform().getXPos(), target.y - this.getXform().getYPos());
        px.setAcceleration([vectorTowards.x*0.25,vectorTowards.y*0.25]);
    
	// size delta
	p.setSizeDelta(0.98);
	return p;
    }
  }