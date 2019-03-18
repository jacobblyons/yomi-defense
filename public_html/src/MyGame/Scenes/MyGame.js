"use strict";
class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.mSmallCam = null;
    this.gm = GameManager.instance;
    this.mWavingInput = null;
    this.mVapingInput = null;
    this.mLightController = null;
    this.EnemySet = null;
    this.TowerSet = null;

    this.HUD = null;
    this.enemy = null;
    this.kTexture = "assets/SpriteSheet.png";
    this.kOKParticleTexture = "assets/ParticleSystem/OK.png";
    this.kXParticleTexture = "assets/ParticleSystem/X.png";
    this.kWPParticleTexture = "assets/ParticleSystem/P2.png";
    this.kTParticleTexture = "assets/ParticleSystem/P1.png";
    this.kRParticleTexture = "assets/ParticleSystem/particle.png"
    this.kSKParticleTexture = "assets/ParticleSystem/SK.png";
    this.mParticles = new ParticleGameObjectSet();
    this.showSmallCam = false;
    this.canShowSmallCam = true;
    this.towerCount = 0;
    this.kBGAudio = "assets/audio/Synth.wav";
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

  loadScene() {
    gEngine.Textures.loadTexture(this.kTexture);
    gEngine.AudioClips.loadAudio(this.kBGAudio);
    gEngine.AudioClips.loadAudio(this.C2clip);
    gEngine.AudioClips.loadAudio(this.C3clip);
    gEngine.AudioClips.loadAudio(this.C8clip);
    gEngine.AudioClips.loadAudio(this.C9clip);
    gEngine.AudioClips.loadAudio(this.C10clip);
    gEngine.AudioClips.loadAudio(this.FBS8clip);
    gEngine.AudioClips.loadAudio(this.HHSclip);
    gEngine.AudioClips.loadAudio(this.IKclip);
    gEngine.AudioClips.loadAudio(this.KDclip);
    gEngine.AudioClips.loadAudio(this.L7clip);
    gEngine.AudioClips.loadAudio(this.L8clip);
    gEngine.AudioClips.loadAudio(this.SDclip);
  }
  unloadScene() {
    gEngine.AudioClips.stopBackgroundAudio();
    GameManager.instance.sceneSwapReady();
  }
  initialize() {
    var AppState = this.gm.State.AppState;
    this.mCam = new Camera(
      vec2.fromValues(AppState.CameraCenter.x, AppState.CameraCenter.y), // position of the camera
      AppState.CameraWidth, // width of camera
      [0, 0, AppState.CanvasWidth, AppState.CanvasHeight] // viewport (orgX, orgY, width, height)
    );
    this.mSmallCam = new Camera(
      vec2.fromValues(AppState.CameraCenter.x, AppState.CameraCenter.y - 5), // position of the camera
      AppState.CameraWidth - 25, // width of camera
      [280, 210, AppState.CanvasWidth * 0.3, AppState.CanvasHeight * 0.3 + 20]
    ); // viewport (orgX, orgY, width, height));
    this.mCam.setBackgroundColor([12 / 255, 13 / 255, 15 / 255, 1]);
    this.mSmallCam.setBackgroundColor([0, 0, 0, 0]);
    this.BG = new LightRenderable(this.kTexture);
    this.BG.setElementPixelPositions(512, 1142, 650, 1280);
    this.BG.getXform().setSize(100, 90);
    this.BG.getXform().setPosition(50, 50);

    this.mWavingInput = new WavingInput(this);
    this.mVapingInput = new VapingInput(this);

    this.mWaveSpawner = new WaveSpawner(this);
    this.mHUD = new HUD();
    this.EnemySet = new GameObjectSet();
    this.TowerSet = new GameObjectSet();
    this.WaypointSet = new GameObjectSet();
    this.PlayerOneBaseSet = new GameObjectSet();
    this.PlayerTwoBaseSet = new GameObjectSet();

    this._initializePlayerOneBases();
    this._initializePlayerTwoBases();
    RoundManager.instance.OnRoundEnd.subscribe(this._cleanupRound.bind(this));
    this.mLightController = new LightController(this);
    var v = gEngine.DefaultResources.getGlobalAmbientColor();
    v[0] = 0.5;
    v[1] = 0.5;
    v[2] = 0.5;
    gEngine.AudioClips.playBackgroundAudio(this.kBGAudio);
  }

  update() {
    this._sortTheTowersForLayering();
    this.mWaveSpawner.update();
    this.mWavingInput.update();
    this.mVapingInput.update();

    this.mHUD.update();
    //this.enemy.update();
    this.EnemySet.update();
    //this.updateEnemy();
    this.WaypointSet.update();
    this.TowerSet.update();
    this.mCam.update();

    //handle game flow input
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
      if (this.canShowSmallCam) this.showSmallCam = true;
    } else {
      this.showSmallCam = false;
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
      switch (GameManager.instance.State.RoundState.Turn) {
        case Turn.RoundMessage:
          RoundManager.instance.readyForRound();
          break;
        case Turn.VapingReadyUp:
          RoundManager.instance.vapingPlayerReady();
          break;
        case Turn.WavingReadyUp:
          RoundManager.instance.wavingPlayerReady();
          break;
        case Turn.Vaping:
          RoundManager.instance.vapingPlayerFinished();
          break;
      }
    }
    this.mParticles.update();
  }

  draw() {
    this.mCam.setupViewProjection();

    this.BG.draw(this.mCam);
    this.EnemySet.draw(this.mCam);
    this.WaypointSet.draw(this.mCam);
    this.TowerSet.draw(this.mCam);
    this.PlayerOneBaseSet.draw(this.mCam);
    this.PlayerTwoBaseSet.draw(this.mCam);
    this.mHUD.draw(this.mCam);
    this.mParticles.draw(this.mCam);
    if (this.showSmallCam) {
      this.mSmallCam.setupViewProjection();
      this.BG.draw(this.mSmallCam);
      this.EnemySet.draw(this.mSmallCam);
      this.WaypointSet.smallDraw(this.mSmallCam);
      this.TowerSet.draw(this.mSmallCam);
      this.PlayerOneBaseSet.draw(this.mSmallCam);
      this.PlayerTwoBaseSet.draw(this.mSmallCam);
    }
  }

  instantiateEnemy() {
    var _enemy = new Enemy(this.WaypointSet, this, this.kTexture);
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    var selectedSpawnID = GameManager.instance.State.RoundState.SelectedSpawnBase;
    var startPos =
      p1Role === PlayerRole.Waving
        ? GameManager.instance.State.GameState.PlayerOne.Bases[selectedSpawnID]
        : GameManager.instance.State.GameState.PlayerTwo.Bases[selectedSpawnID];
    _enemy.getXform().setXPos(startPos.x);
    _enemy.getXform().setYPos(startPos.y);
    this.EnemySet.addToSet(_enemy);
    this.mLightController.addLightsToDynamicObjects(_enemy);
    gEngine.AudioClips.playACue(this.L7clip);
  }

  instantiateWaypoint(pos) {
    var canPlace = true;
    for (var i = RoundManager.instance.State.Waypoints.length; i > 0; i--) {
      var WPPos = RoundManager.instance.State.Waypoints[i - 1];
      var dist = Math.sqrt(Math.pow(WPPos.x - pos.x, 2) + Math.pow(WPPos.y - pos.y, 2));
      if (dist < 5) {
        canPlace = false;
      }
    }
    for (var i = RoundManager.instance.State.FakeWaypoints.length; i > 0; i--) {
      var WPPos = RoundManager.instance.State.FakeWaypoints[i - 1];
      var dist = Math.sqrt(Math.pow(WPPos.x - pos.x, 2) + Math.pow(WPPos.y - pos.y, 2));
      if (dist < 5) {
        canPlace = false;
      }
    }
    if (canPlace) {
      var waypoint = new Waypoint(pos, this.kTexture);
      this.WaypointSet.addToSet(waypoint);
      this.mLightController.addLightsToDynamicObjects(waypoint);
      gEngine.AudioClips.playACue(this.L7clip);
      for (var i = 0; i < 5; i++) {
        var p = this.createWPParticle(pos.x, pos.y);
        this.mParticles.addToSet(p);
      }
    } else {
      var p = this.createXParticle(pos.x, pos.y);
      this.mParticles.addToSet(p);
      gEngine.AudioClips.playACue(this.L8clip);
    }
  }

  instantiateTower(pos) {
    if(this.towerCount < (Math.floor((RoundManager.instance.State.Waypoints.length + RoundManager.instance.State.FakeWaypoints.length)/2) + 2)){
        var tower = new Tower(pos, this.EnemySet, this.kTexture);
        this.TowerSet.addToSet(tower);
        this.mLightController.addLightsToDynamicObjects(tower);
        for (var i = 0; i < 5; i++) {
          var p = this.createTParticle(pos.x, pos.y);
          this.mParticles.addToSet(p);
        }
        var p = this.createRangeParticle(pos.x,pos.y,tower.towerType);
        this.mParticles.addToSet(p);
        gEngine.AudioClips.playACue(this.FBS8clip);
        this.towerCount++;
    }else {
      var p = this.createXParticle(pos.x, pos.y);
      this.mParticles.addToSet(p);
      gEngine.AudioClips.playACue(this.L8clip);
    }
  }

  enemyAtEndPoint(e) {
    this.canShowSmallCam = true;
    var p = this.createOKParticle(e.getXform().getXPos(), e.getXform().getYPos());
    this.mParticles.addToSet(p);
    if (e.speed > 1.39) {
      this.gm.State.GameState.PlayerOne.Score += this.gm.State.GameState.PlayerOne.Role == PlayerRole.Waving ? 1 : 0;
      this.gm.State.GameState.PlayerTwo.Score += this.gm.State.GameState.PlayerTwo.Role == PlayerRole.Waving ? 1 : 0;
    }
    this.EnemySet.removeFromSet(e);
    RoundManager.instance.enemyReachedEndPoint();
    GameManager.instance.mGameScene.getCamera().shake(-1, -1, 30, 10);
    gEngine.AudioClips.playACue(this.C9clip);
  }

  _initializePlayerOneBases() {
    var bases = GameManager.instance.State.GameState.PlayerOne.Bases;
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P1.One], BaseID.P1.One));
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P1.Two], BaseID.P1.Two));
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P1.Three], BaseID.P1.Three));
  }

  _initializePlayerTwoBases() {
    var bases = GameManager.instance.State.GameState.PlayerTwo.Bases;
    this.PlayerTwoBaseSet.addToSet(new Base(bases[BaseID.P2.One], BaseID.P2.One));
    this.PlayerTwoBaseSet.addToSet(new Base(bases[BaseID.P2.Two], BaseID.P2.Two));
    this.PlayerTwoBaseSet.addToSet(new Base(bases[BaseID.P2.Three], BaseID.P2.Three));
  }

  _sortTheTowersForLayering() {
    this.TowerSet.mSet.sort((a, b) => b.getXform().getPosition()[1] - a.getXform().getPosition()[1]);
  }

  _cleanupRound() {
    this.EnemySet.removeAll();
    this.WaypointSet.removeAll();
    this.TowerSet.removeAll();
    this.canShowSmallCam = false;
    this.towerCount =0;
  }

  createOKParticle(atX, atY) {
    var life = 90;
    var p = new ParticleGameObject(this.kOKParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(15, 30);
    p.getXform().incRotationByDegree(Math.random()*15-30);
    var px = p.getParticle();
    px.setVelocity([0, 2]);
    px.setAcceleration([0, 10]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }

  createXParticle(atX, atY) {
    var life = 60;
    var p = new ParticleGameObject(this.kXParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(10, 10);
    var px = p.getParticle();
    px.setVelocity([0, 2]);
    px.setAcceleration([0, 10]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }

  createWPParticle(atX, atY) {
    var life = 60;
    var p = new ParticleGameObject(this.kWPParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(7, 7);
    var px = p.getParticle();
    var rx = Math.random() * 2 - 1;
    var ry = Math.random() * 2 - 1;
    px.setVelocity([rx * 5, ry * 5]);
    px.setAcceleration([rx, ry]);

    // size delta
    p.setSizeDelta(0.98);
    return p;    
  }
  createTParticle(atX, atY) {
    var life = 120;
    var p = new ParticleGameObject(this.kTParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(7, 7);
    p.getXform().incRotationByDegree(Math.random() * 180 - 90);
    var px = p.getParticle();
    var rx = Math.random() * 2 - 1;
    var ry = Math.random() * 2 - 1;
    px.setVelocity([rx * 15, ry * 15]);
    px.setAcceleration([rx, ry]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
    createRangeParticle(atX, atY, towerType) {
    var life = 120;
    var p = new ParticleGameObject(this.kRParticleTexture, atX, atY, life);
    // size of the particle
    var range = 1;
    var color = [0,0,0,0];
    if(towerType === 0){
        range = 15;
        color = [1,.08,.58,.75];
    }
    if(towerType === 1){
        range = 25;
        color = [0,1,.5,.75];
    }
    if(towerType === 2){
        range = 40;
        color = [0,1,1,.75];
    }    
    p.setFinalColor(color);
    p.getXform().setSize(2*range, 2*range);
    // size delta
    p.setSizeDelta(0.98);
    return p;
  }

  createSKParticle(atX, atY) {
    var life = 120;
    var p = new ParticleGameObject(this.kSKParticleTexture, atX, atY, life);
    
    // size of the particle
    p.getXform().setSize(12, 15);
    var px = p.getParticle();
    px.setVelocity([1, 1]);
    px.setAcceleration([0, 1]);
    // size delta
    p.setSizeDelta(0.98);
    p.getXform().incRotationByDegree(Math.random()*15-30);
    this.mParticles.addToSet(p);
    gEngine.AudioClips.playACue(this.IKclip);
    //return p;
  }
  getCamera() {
    return this.mCam;
  }
}
