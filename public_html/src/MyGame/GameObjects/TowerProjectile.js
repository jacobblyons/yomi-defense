class TowerProjectile extends GameObject {
  constructor(targetObject, towerPos, towerType) {
    var rend = new LightRenderable("assets/SpriteSheet.png");
    rend.setElementPixelPositions(80, 430, 826, 1222);
    super(rend);
    this.getXform().setSize(1, 1);
    this.getXform().setXPos(towerPos.x);
    this.getXform().setYPos(towerPos.y);
    this.mTargetObject = targetObject;
    this.vectorTowards = null;
    this.kParticleTexture = "assets/ParticleSystem/particle.png";
    this.mParticles = new ParticleGameObjectSet();
    this.towerType = towerType;
    this.lifespan = 60;
    if (this.towerType === 0) this.speed = 1.15;
    if (this.towerType === 1) this.speed = 1.25;
    if (this.towerType === 2) this.speed = 1.45;
  }

  update() {
    var targetPos = new Vector2(
      this.mTargetObject.getXform().getPosition()[0],
      this.mTargetObject.getXform().getPosition()[1]
    );
    this.moveTowards(targetPos, this.speed);
    var p = this.createParticle(this.getXform().getXPos(), this.getXform().getYPos());
    this.mParticles.addToSet(p);
    this.mParticles.update();
  }
  draw(cam) {
    super.draw(cam);
    this.mParticles.draw(cam);
  }
  moveTowards(targetPos, dist) {
    var transform = this.getXform();
    this.vectorTowards = new Vector2(targetPos.x - transform.getXPos(), targetPos.y - transform.getYPos());
    this.vectorTowards = this.vectorTowards.getNormalized();
    transform.incXPosBy(this.vectorTowards.x * dist);
    transform.incYPosBy(this.vectorTowards.y * dist);
  }

  isAtTarget() {
    if (this.getXform().getXPos() === this.mTargetObject.x && this.getXform().getYPos() === this.mTargetObject.y) {
      return true;
    } else {
      return false;
    }
  }

  createParticle(atX, atY) {
    var life = 150;
    var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);
    if (this.towerType === 0) p.getRenderable().setColor([0, 1, 1, 1]);
    if (this.towerType === 1) p.getRenderable().setColor([1, .08, .47, 1]);
    if (this.towerType === 2) p.getRenderable().setColor([0.3, 0, .51, 1]);
    // size of the particle
    var r = Math.random();
    p.getXform().setSize(r, r);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
}
