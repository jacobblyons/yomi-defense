class Enemy extends GameObject {
  constructor(WS, sceneRef, texture) {
    var rend = new SpriteRenderable(texture);
    super(rend);
    var type = Math.floor(Math.random()*3);
    if(type === 0){
        rend.setElementPixelPositions(256,384,1926,2048);
        this.getXform().setSize(3,3);
        this.speed = 0.2;
        this.rotation = Math.random()*2;}
    if(type === 1){
        rend.setElementPixelPositions(1372,1629,1828,2048);
        this.getXform().setSize(4.5,3);
        this.speed = 0.35;
        this.rotation = Math.random()*3 + 2;}
    if(type === 2){
        rend.setElementPixelPositions(512,893,1536,1792);
        this.getXform().setSize(4.5,3);
        this.speed = 0.5;
        this.rotation = Math.random()*5 + 5;
    }
    this.kParticleTexture = "assets/ParticleSystem/RO.png";
    this.mParticles = new ParticleGameObjectSet();
    
        //rend.setColor([0, 1, 0, 1]);
    this.gm = GameManager.instance;
    this.waypointsReached = 0;
    this.WaypointSet = WS;
    this.sceneRef = sceneRef;
    
    this.dead = false;
    this.maxedSpeedAnim = true;
    
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
        this.sceneRef.enemyAtEndPoint(this);
        this.reachedGoal();
      } else {
        this.moveTowards(_endPos, this.speed);
      }
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
    if (this.speed < 1){
        this.speed += 0.1;
        this.speed.toFixed(5);
    }else{
        if (this.maxedSpeedAnim){
            //animate reaching max speed
            this.maxedSpeedAnim = false;
        }
    }
  }
  nextPoint(){
    for (var i = 0; i < 10; i++){
        var p = this.createParticle(this.getXform().getXPos(),this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
      this.waypointsReached++;
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

    switch (this.mHitPoints) {
      case 2:
        this.getRenderable().setColor([1, 0.65, 0, 1]);
        break;
      case 1:
        this.getRenderable().setColor([1, 0, 0, 1]);
        break;
      case 0:
        return true;
        break;
    }
  }

  _checkEndCollisions() {}

  createParticle(atX,atY){
      	var life = 120;
	var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);	
        //p.getRenderable().setColor([1, 1, 1, 1]);
	// size of the particle	
	p.getXform().setSize(3, 3);
        var px = p.getParticle();
        var rx = Math.random()*10 - 5;
        var ry = Math.random()*10 - 5;
        px.setVelocity([rx,ry]);
	// final color
	var fr = 3.5 + Math.random();
	var fg = 0.4 + 0.1 * Math.random();
	var fb = 0.3 + 0.1 * Math.random();
	p.setFinalColor([fr, fg, fb, 0.6]);
    
	// velocity on the particle
	var fx = 10 - 20 * Math.random();
	var fy = 10 * Math.random();
	//p.getPhysicsComponent().setVelocity([fx, fy]);
    
	// size delta
	p.setSizeDelta(0.98);
    
	return p;
    }
  }