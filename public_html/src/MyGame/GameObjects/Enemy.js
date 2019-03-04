class Enemy extends GameObject {
  constructor(WS,ES) {
    var rend = new Renderable();
    rend.setColor([1, 0, 0, 1]);
    super(rend);
    //this.pos = pos;
    //this.getXform().setXPos(pos.x);
    //this.getXform().setYPos(pos.y);
    this.waypointsReached = 0;
    this.WaypointSet = WS;
    this.EndPointSet = ES;
    this.gm = GameManager.instance;
  }

  update() {
    //this.moveTowards(new Vector2(50, 50), 0.2);
      if(this.waypointsReached < this.WaypointSet.size()){ 
        //console.log(this.waypointsReached);
        var _waypt = this.WaypointSet.getObjectAt(this.waypointsReached);
        this.moveTowards(_waypt.pos,0.2);
        var dX = this.getXform().getXPos() - _waypt.getXform().getXPos();
        var dY = this.getXform().getYPos() - _waypt.getXform().getYPos();
        var dist = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        if (dist < 0.2){
          this.waypointsReached++;
        }
      }else{
        var _endPos = GameManager.instance.State.GameState.EndPoints[RoundManager.instance.State.SelectedEndPoint];
        //var _endpt = this.EndPointSet.getObjectAt(1);//.getXform().getPosition();
        console.log(_endPos);
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
}
