class TowerProjectile extends GameObject {
  constructor(targetObject, towerPos, towerType) {
    var rend = new SpriteRenderable("assets/SpriteSheet.png");    
    rend.setElementPixelPositions(80,430,826,1222);
    super(rend);    
    this.getXform().setSize(1,1);
    this.getXform().setXPos(towerPos.x);
    this.getXform().setYPos(towerPos.y);
    this.mTargetObject = targetObject;
    this.vectorTowards = null;
    this.kParticleTexture = "assets/ParticleSystem/particle.png";
    this.mParticles = new ParticleGameObjectSet();
    this.towerType = towerType;
    if(this.towerType === 0)
        this.speed = 1.1;
    if(this.towerType === 1)
        this.speed = 1.25;
    if(this.towerType === 2)
        this.speed = 1;
  }

  update() {
    var targetPos = new Vector2(
      this.mTargetObject.getXform().getPosition()[0],
      this.mTargetObject.getXform().getPosition()[1]
    );
    this.moveTowards(targetPos, this.speed);
    var p = this.createParticle(this.getXform().getXPos(),this.getXform().getYPos());
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
  
  createParticle(atX,atY){
      	var life = 30 + Math.random() * 200;
	var p = new ParticleGameObject(this.kParticleTexture, atX, atY, life);
	if (this.towerType === 0)
            p.getRenderable().setColor([1, 0, 0, 1]);
        if (this.towerType === 1)
            p.getRenderable().setColor([0, 1, 0, 1]);
        if (this.towerType === 2)
            p.getRenderable().setColor([0, 0, 1, 1]);
	// size of the particle
	var r = Math.random();
	p.getXform().setSize(r, r);
    
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
