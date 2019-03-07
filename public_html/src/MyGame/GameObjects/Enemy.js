class Enemy extends GameObject {
  constructor(WS,ES) {
    var rend = new Renderable();
    rend.setColor([0, 1, 0, 1]);
    super(rend);
    //this.pos = pos;
    //this.getXform().setXPos(pos.x);
    //this.getXform().setYPos(pos.y);
    this.waypointsReached = 0;
    this.WaypointSet = WS;
    this.EndPointSet = ES;
    this.mHitPoints = 3;
    this.gm = GameManager.instance;
  }

  update() {

      if(this.waypointsReached < this.WaypointSet.size()){ 

        var _waypt = RoundManager.instance.State.Waypoints[this.waypointsReached];
        this.moveTowards(_waypt,0.2);
        var dX = this.getXform().getXPos() - _waypt.x;
        var dY = this.getXform().getYPos() - _waypt.y;
        var dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (dist < 0.2){
          this.waypointsReached++;
        }
      }else{
        var _endPos = GameManager.instance.State.GameState.EndPoints[RoundManager.instance.State.SelectedEndPoint];               
        this.moveTowards(_endPos,0.2);
      }
    }

  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    var vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());
    vectorTowards = vectorTowards.getNormalized();
    transform.incXPosBy(vectorTowards.x * dist);
    transform.incYPosBy(vectorTowards.y * dist);
  }
  
  hit(){
      this.mHitPoints--;
      
      switch(this.mHitPoints){
          case 2:
               this.getRenderable().setColor([1,.65,0,1]);
               break;
           case 1:
               this.getRenderable().setColor([1,0,0,1]);
               break;
           
           case 0:
                return true;
                break;
          
      }
  }
}
