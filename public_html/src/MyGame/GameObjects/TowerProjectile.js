class TowerProjectile extends GameObject {
  constructor(targetObjectPos, towerPos) {
    var rend = new SpriteRenderable("assets/ParticleSystem/flameparticle.png");
    rend.setColor([0, 1, 0, 1]);
    super(rend);
    this.getXform().setXPos(towerPos.x);
    this.getXform().setYPos(towerPos.y);
    this.mTargetObjectPos = targetObjectPos;
  }

  update() {
    this.moveTowards(this.mTargetObjectPos, 0.1);
  }

  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    var vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());

    vectorTowards = vectorTowards.getNormalized();

    transform.incXPosBy(vectorTowards.x * dist);
    transform.incYPosBy(vectorTowards.y * dist);
  }

  isAtTarget() {
    if (this.getXform().getXPos() === this.mTargetObjectPos[0] && this.getXform().getYPos() === this.mTargetObjectPos[1]) {
      return true;
    } else {
      return false;
    }
  }
}
