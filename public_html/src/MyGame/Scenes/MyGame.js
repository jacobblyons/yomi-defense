"use strict";
class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.mSmallCam = null;
    this.gm = GameManager.instance;   
    this.mWavingInput = null;
    this.mVapingInput = null;    
    this.EnemySet = null;
    this.TowerSet = null;
    this.HUD = null;
    this.enemy = null;
    this.kTexture = "assets/SpriteSheet.png";
    this.kOKParticleTexture = "assets/ParticleSystem/OK.png";
    this.kXParticleTexture = "assets/ParticleSystem/X.png";
    this.kWPParticleTexture = "assets/ParticleSystem/P2.png";
    this.kTParticleTexture = "assets/ParticleSystem/P1.png";
    this.mParticles = new ParticleGameObjectSet();
    this.showSmallCam = false;
    this.canShowSmallCam = true;
  }

  loadScene() {
    gEngine.Textures.loadTexture(this.kTexture);
  }
  unloadScene() {
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
      vec2.fromValues(AppState.CameraCenter.x, AppState.CameraCenter.y), // position of the camera
      AppState.CameraWidth, // width of camera
      [280, 210, AppState.CanvasWidth * 0.3, AppState.CanvasHeight * 0.3]
    ); // viewport (orgX, orgY, width, height));
    this.mCam.setBackgroundColor([0.2, 0.2, 0.2, 1]);
    this.BG = new SpriteRenderable(this.kTexture);
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
    if(this.showSmallCam){
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
      this.WaypointSet.addToSet(new Waypoint(pos, this.kTexture));
      for (var i = 0; i < 5; i++){
            var p = this.createWPParticle(pos.x, pos.y);
            this.mParticles.addToSet(p);
        }
    } else {
      var p = this.createXParticle(pos.x, pos.y);
      this.mParticles.addToSet(p);
    }
  }

  instantiateTower(pos) {
    this.TowerSet.addToSet(new Tower(pos, this.EnemySet, this.kTexture));
    for (var i = 0; i < 5; i++){
        var p = this.createTParticle(pos.x, pos.y);
        this.mParticles.addToSet(p);
    }    
  }

  enemyAtEndPoint(e) {
    this.canShowSmallCam = true;
    var p = this.createOKParticle(e.getXform().getXPos(), e.getXform().getYPos());
    this.mParticles.addToSet(p);
    this.EnemySet.removeFromSet(e);
    RoundManager.instance.enemyReachedEndPoint();
  }

  _initializePlayerOneBases() {
    var bases = GameManager.instance.State.GameState.PlayerOne.Bases;
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P1.One], BaseID.P1.One));
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P1.Two], BaseID.P1.Two));
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P1.Three], BaseID.P1.Three));
  }

  _initializePlayerTwoBases() {
    var bases = GameManager.instance.State.GameState.PlayerTwo.Bases;
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P2.One], BaseID.P2.One));
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P2.Two], BaseID.P2.Two));
    this.PlayerOneBaseSet.addToSet(new Base(bases[BaseID.P2.Three], BaseID.P2.Three));
  }

  _sortTheTowersForLayering() {
    this.TowerSet.mSet.sort((a, b) => b.getXform().getPosition()[1] - a.getXform().getPosition()[1]);
  }

  _cleanupRound() {
    this.EnemySet.removeAll();
    this.WaypointSet.removeAll();
    this.TowerSet.removeAll();
    this.canShowSmallCam = false;
  }
  
  createOKParticle(atX,atY){
    var life = 90;
    var p = new ParticleGameObject(this.kOKParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(15, 30);
    var px = p.getParticle();
    px.setVelocity([0, 2]);
    px.setAcceleration([0, 10]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
    
  createXParticle(atX,atY){
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
  
    createWPParticle(atX,atY){
    var life = 60;
    var p = new ParticleGameObject(this.kWPParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(7, 7);
    var px = p.getParticle();    
    var rx = Math.random()*2 - 1;
    var ry = Math.random()*2 - 1;
    px.setVelocity([rx*5, ry*5]);
    px.setAcceleration([rx, ry]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
    createTParticle(atX,atY){
    var life = 45;
    var p = new ParticleGameObject(this.kTParticleTexture, atX, atY, life);
    // size of the particle
    p.getXform().setSize(7, 7);
    p.getXform().incRotationByDegree(Math.random()*180-90);
    var px = p.getParticle();
    var rx = Math.random()*2 - 1;
    var ry = Math.random()*2 - 1;
    px.setVelocity([rx*5, ry*5]);
    px.setAcceleration([rx, ry]);

    // size delta
    p.setSizeDelta(0.98);
    return p;
  }
}