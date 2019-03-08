class TowerProjectile extends GameObject {
  constructor(targetObject, towerPos) {
    var rend = new SpriteRenderable("assets/SpriteSheet.png");    
    rend.setElementPixelPositions(80,430,826,1222);
    super(rend);    
    this.getXform().setSize(1,1);
    this.getXform().setXPos(towerPos.x);
    this.getXform().setYPos(towerPos.y);
    this.mTargetObject = targetObject;
  }

  update() {
    var targetPos = new Vector2(
      this.mTargetObject.getXform().getPosition()[0],
      this.mTargetObject.getXform().getPosition()[1]
    );
    this.moveTowards(targetPos, 1);
  }

  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    var vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());
    vectorTowards = vectorTowards.getNormalized();
    transform.incXPosBy(vectorTowards.x * dist);
    transform.incYPosBy(vectorTowards.y * dist);
  }

  isAtTarget() {
    if (this.getXform().getXPos() === this.mTargetObject.x && this.getXform().getYPos() === this.mTargetObject.y) {
      return true;
    } else {
      return false;
    }
  }
}
