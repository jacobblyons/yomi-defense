class Enemy extends GameObject {
  constructor(WS, sceneRef, texture) {
    var rend = new LightRenderable(texture);
    super(rend);
    var type = Math.floor(Math.random() * 3);
    if (type === 0) {
      rend.setElementPixelPositions(256, 384, 1926, 2048);
      this.getXform().setSize(3, 3);
      this.speed = 0.2;
      this.rotation = Math.random() * 8-16;
      this.mHitPoints = 3;
    }
    if (type === 1) {
      rend.setElementPixelPositions(1372, 1629, 1828, 2048);
      this.getXform().setSize(3, 3);
      this.speed = 0.35;
      this.rotation = Math.random() * 3 - 6;
      this.mHitPoints = 2;
    }
    if (type === 2) {
      rend.setElementPixelPositions(1629, 1886, 1802, 2048);
      this.getXform().setSize(3, 3);
      this.speed = 0.6;
      this.rotation = Math.random() * 2.5 -5;
      this.mHitPoints = 1;
    }
    this.isSpecial = false;
    var r = Math.random();
    if (r< 0.20) this.isSpecial = true;
    if (this.isSpecial){
        this.getRenderable().setColor([1,1,1,1]);
        this.mHitPoints++;
    }
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
    this.mShake = new ShakePosition(this.getXform().getSize()[0]/2, this.getXform().getSize()[1]/2, 1, 60);
    this.mShakeFlag = false;
    
    this.C2clip = "assets/audio/C2.wav";
    this.C3clip = "assets/audio/C3.wav";
    this.C8clip = "assets/audio/C8.wav";
    this.C9clip = "assets/audio/C9.wav";
    this.C10clip = "assets/audio/C10.wav";
    this.FBS8clip = "assets/audio/FBS8.wav";
    this.HHSclip = "assets/audio/HHS.wav";
    this.IKclip = "assets/audio/IK.wav";
    this.KDclip = "assets/audio/KD.wav";
    this.L7clip = "assets/audio/L7.wav";
    this.L8clip = "assets/audio/L8.wav";
    this.SDclip = "assets/audio/SD.wav";   
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
    if(this.isSpecial){
        var p = this.createSpecParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
    }
    this.mParticles.update();
    if(this.mShakeFlag){
        if(this.mShake.shakeDone()){
            this.mShakeFlag = false;
            this.mShake = new ShakePosition(this.getXform().getSize()[0]/2, this.getXform().getSize()[1]/2, 1, 60);            
        }
        else
        {
        var SR = this.mShake.getShakeResults();
        this.getXform().setSize(3-SR[0], 3-SR[1]);
        }
    }
  }
  draw(cam) {
    super.draw(cam);
    this.mParticles.draw(cam);
  }
  reachedGoal() {
    this.dead = true;
  }
  speedUp() {
    if (this.speed < this.maxSpeed) {
      this.speed += 0.2;
      this.speed.toFixed(5);
      this.rotation = Math.random() * 6-12;
      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
        var p = this.createCRParticle(this.getXform().getXPos(), this.getXform().getYPos());
        this.mParticles.addToSet(p);
      }
    } else {
      var p = this.createCRParticle(this.getXform().getXPos(), this.getXform().getYPos());
      this.mParticles.addToSet(p);
      this.rotation = Math.random() * 8-16;
    }
  }

  nextPoint() {
    for (var i = 0; i < 7; i++) {
      var p = this.createRParticle(this.getXform().getXPos(), this.getXform().getYPos());
      this.mParticles.addToSet(p);
      //this.mHitPoints++;
    }
    if (this.incHP) this.mHitPoints++;
    this.waypointsReached++;
    this.incHP = !this.incHP;
    gEngine.AudioClips.playACue(this.C9clip);
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
    this.mShakeFlag = true;
    for (var i = 0; i < 5; i++) {
      var p = this.createSplashParticle(this.getXform().getXPos(), this.getXform().getYPos());
      this.mParticles.addToSet(p);
    }
    if (this.mHitPoints < 0) {
      //var p = this.createSKParticle(this.getXform().getXPos(), this.getXform().getYPos());
      //this.mParticles.addToSet(p);
      if (this.isSpecial){
          this.sceneRef.specialDeath(this.getXform().getXPos(), this.getXform().getYPos())
      }
      for (var i = 0; i < 5; i++) {
        this.sceneRef.createTParticle(this.getXform().getXPos(), this.getXform().getYPos());
      }
      this.sceneRef.createSKParticle(this.getXform().getXPos(), this.getXform().getYPos());
      return true;
    }
    gEngine.AudioClips.playACue(this.C8clip);
  }

  _checkEndCollisions() {}

  createRParticle(atX, atY) {
    var life = 120;
    var p = new ParticleGameObject(this.kROParticleTexture, atX, atY, life);
    //p.getRenderable().setColor([1, 1, 1, 1]);
    // size of the particle
    p.getXform().setSize(3, 3);
    var px = p.getParticle();
    var rx = Math.random() * 10 - 5;
    var ry = Math.random() * 10 - 5;
    px.setVelocity([rx, ry]);

    // size delta
    p.setSizeDelta(0.98);

    return p;
  }
  createSKParticle(atX, atY) {
    var life = 150;
    var p = new ParticleGameObject(this.kSKParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(10, 15);
    var px = p.getParticle();
    px.setVelocity([1, 1]);
    px.setAcceleration([0, 1]);
    // size delta
    p.setSizeDelta(0.98);
    return p;
  }

  createCRParticle(atX, atY) {
    var life = 120;
    var p = new ParticleGameObject(this.kCRParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(10, 10);
    var px = p.getParticle();
    var rx = Math.random() * 10 - 5;
    var ry = Math.random() * 10 - 5;
    px.setVelocity([rx, ry]);
    px.setAcceleration([0, 5]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
  createSplashParticle(atX, atY) {
    var life = 120;
    var texture = null;
    var r = Math.floor(Math.random() * 4);
    if (r === 0) texture = this.kP1ParticleTexture;
    if (r === 1) texture = this.kP2ParticleTexture;
    if (r === 2) texture = this.kP3ParticleTexture;
    if (r === 3) texture = this.kP4ParticleTexture;
    var p = new ParticleGameObject(this.kP4ParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(3, 3);
    var px = p.getParticle();
    var rx = Math.random() * 10 - 5;
    var ry = Math.random() * 10 - 5;
    px.setVelocity([rx, ry]);
    var target = null;
    if (this.waypointsReached < RoundManager.instance.State.Waypoints.length) {
      target = RoundManager.instance.State.Waypoints[this.waypointsReached];
    } else {
      var endBaseID = GameManager.instance.State.RoundState.SelectedEndBase;
      target =
        this.p1Role === PlayerRole.Vaping
          ? GameManager.instance.State.GameState.PlayerOne.Bases[endBaseID]
          : GameManager.instance.State.GameState.PlayerTwo.Bases[endBaseID];
    }
    var vectorTowards = new Vector2(target.x - this.getXform().getXPos(), target.y - this.getXform().getYPos());
    px.setAcceleration([vectorTowards.x * 0.25, vectorTowards.y * 0.25]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
  createSpecParticle(atX, atY) {
    var life = 60;        
    var p = new ParticleGameObject(this.kP3ParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(6, 6);
    p.getXform().incRotationByDegree(Math.random()*90);
    var px = p.getParticle();
    var rx = Math.random() * 10 - 5;
    var ry = Math.random() * 10 - 5;
    px.setVelocity([rx, ry]);
    var target = null;
    if (this.waypointsReached < RoundManager.instance.State.Waypoints.length) {
      target = RoundManager.instance.State.Waypoints[this.waypointsReached];
    } else {
      var endBaseID = GameManager.instance.State.RoundState.SelectedEndBase;
      target =
        this.p1Role === PlayerRole.Vaping
          ? GameManager.instance.State.GameState.PlayerOne.Bases[endBaseID]
          : GameManager.instance.State.GameState.PlayerTwo.Bases[endBaseID];
    }
    var vectorTowards = new Vector2(target.x - this.getXform().getXPos(), target.y - this.getXform().getYPos());
    px.setAcceleration([vectorTowards.x * 0.25, vectorTowards.y * 0.25]);
    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
}
