"use strict";

class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.gm = GameManager.instance;
    this.mWavingInput = null;
    this.mVapingInput = null;
    this.HUD = null;
    this.EnemySet = null;
    this.TowerSet = null;
    this.mTowerProjectileSet = null;
    this.enemy = null;
    this.spawnTimer = 0;
    this.waveCount = 20;
    
    this.kFireSprite = "assets/ParticleSystem/flameparticle.png";
  }

  loadScene() {
      gEngine.Textures.loadTexture(this.kFireSprite);
  }
  unloadScene() {}
  initialize() {
    var AppState = this.gm.State.AppState;
    this.mCam = new Camera(
      vec2.fromValues(AppState.CameraCenter.x, AppState.CameraCenter.y), // position of the camera
      AppState.CameraWidth, // width of camera
      [0, 0, AppState.CanvasWidth, AppState.CanvasHeight] // viewport (orgX, orgY, width, height)
    );
    this.mCam.setBackgroundColor([0.2, 0.2, 0.2, 1]);

    this.mWavingInput = new WavingInput(this);
    this.mVapingInput = new VapingInput(this);
    this.mHUD = new HUD();
    this.EnemySet = new GameObjectSet();
    this.TowerSet = new GameObjectSet();
    this.WaypointSet = new GameObjectSet();
    this.SpawnPointSet = new GameObjectSet();
    this.EndPointSet = new GameObjectSet();
    this.mTowerProjectileSet = new GameObjectSet();

    this.enemy = new Enemy();
    this.EnemySet.addToSet(this.enemy);
    this._initializeStartPoints();
    this._initializeEndPoints();
  }

  instantiateEnemy() {
    this.EnemySet.addToSet(new Enemy());
  }

  instantiateWaypoint(pos) {
    this.WaypointSet.addToSet(new Waypoint(pos));
  }
  instantiateTower(pos) {
    this.TowerSet.addToSet(new Tower(pos));
  }

  update() {
    if (this.gm.State.RoundState.Turn === "RUNNING_WAVE") {
      if (this.spawnTimer > 120 && this.waveCount > 0) {
        this.spawnTimer = 0;
        this.instantiateEnemy();
        this.waveCount--;
      }
      this.spawnTimer++;

      this.checkRange();
    }

    this.mWavingInput.update();
    this.mVapingInput.update();
    this.mHUD.update();
    //this.enemy.update();
    this.EnemySet.update();
    this.WaypointSet.update();
    this.TowerSet.update();
    this.mTowerProjectileSet.update();

    for(var i = 0; i < this.mTowerProjectileSet.size(); i++){
        var atTarget = this.mTowerProjectileSet.getObjectAt(i).isAtTarget();
        if(atTarget){
            this.mTowerProjectileSet.removeFromSet(this.mTowerProjectileSet.getObjectAt(i));
        }
    }
    //handle game flow input
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
      }
    }

    /* TEST CODE - these should be handled by seperate input handlers for waving and vaping or whatever*/
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.X)) {
      switch (GameManager.instance.State.RoundState.Turn) {
        case Turn.Waving:
          RoundManager.instance.wavingPlayerFinished();
          break;
        case Turn.Vaping:
          RoundManager.instance.vapingPlayerFinished();
          break;
      }
    }
  }
  draw() {
    this.mCam.setupViewProjection();
    this.mHUD.draw(this.mCam);
    //this.enemy.draw(this.mCam);
    this.EnemySet.draw(this.mCam); 
    this.WaypointSet.draw(this.mCam);
    this.TowerSet.draw(this.mCam);
    this.mTowerProjectileSet.draw(this.mCam);
    this.SpawnPointSet.draw(this.mCam);
    this.EndPointSet.draw(this.mCam);
    
  }
  
  checkRange(){
    for(var t = 0; t < this.TowerSet.size(); t++){
        for (var e = 0; e < this.EnemySet.size(); e++){
            var _enemy = this.EnemySet.getObjectAt(e);
            var _tower = this.TowerSet.getObjectAt(t);
            var eX = _enemy.getXform().getXPos(); 
            var eY = _enemy.getXform().getYPos();
            var dX = _tower.getXform().getXPos() - eX;
            var dY = _tower.getXform().getYPos() - eY;
            var dist = Math.sqrt(Math.pow(dX,2)+Math.pow(dY,2));
            if (dist < 10){
                var _enemyColor = _enemy.getRenderable();
                _enemyColor.setColor([.1, .7, .7, 1]); 
                if(this.mTowerProjectileSet.size() < this.TowerSet.size()){
                    this.mTowerProjectileSet.addToSet(new TowerProjectile(_enemy.getXform().getPosition(), _tower.getXform().getPosition()));
                }
                
            }
        }
    }
  }

  _initializeStartPoints() {
    var spawns = GameManager.instance.State.GameState.SpawnPoints;
    spawns.forEach(s => this.SpawnPointSet.addToSet(new SpawnPoint(s)));
  }
  _initializeEndPoints() {
    var ends = GameManager.instance.State.GameState.EndPoints;
    ends.forEach(f => this.EndPointSet.addToSet(new EndPoint(f)));
  }
}
