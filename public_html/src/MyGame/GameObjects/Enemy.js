class Enemy extends GameObject {
  constructor(WS, ES, sceneRef, texture) {
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
    
        //rend.setColor([0, 1, 0, 1]);
    this.gm = GameManager.instance;
    this.waypointsReached = 0;
    this.WaypointSet = WS;
    this.EndPointSet = ES;
    this.sceneRef = sceneRef;
    
    this.dead = false;
    this.maxedSpeedAnim = true;
    
    this.speed = 0.3;
    
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
      var _endPos = GameManager.instance.State.GameState.EndPoints[RoundManager.instance.State.SelectedEndPoint];
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
}
