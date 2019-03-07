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
    this.enemy = null;
  }

  loadScene() {}
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
    this.mWaveSpawner = new WaveSpawner(this);
    this.mHUD = new HUD();

    this.EnemySet = new GameObjectSet();
    this.TowerSet = new GameObjectSet();
    this.WaypointSet = new GameObjectSet();
    this.SpawnPointSet = new GameObjectSet();
    this.EndPointSet = new GameObjectSet();

    this._initializeStartPoints();
    this._initializeEndPoints();
    RoundManager.instance.OnRoundEnd.subscribe(this._cleanupRound.bind(this));
  }

  update() {
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
          //RoundManager.instance.wavingPlayerFinished();
          //handled case safely in waypoint input
          break;
        case Turn.Vaping:
          RoundManager.instance.vapingPlayerFinished();
          break;
      }
    }

    //this._checkForDeadEnemies();
  }
  draw() {
    this.mCam.setupViewProjection();

    //this.enemy.draw(this.mCam);
    this.EnemySet.draw(this.mCam);
    this.WaypointSet.draw(this.mCam);
    this.TowerSet.draw(this.mCam);
    this.SpawnPointSet.draw(this.mCam);
    this.EndPointSet.draw(this.mCam);
    this.mHUD.draw(this.mCam);
  }

  instantiateEnemy(waypointSet) {
    var _enemy = new Enemy(waypointSet, this.EndPointSet, this);
    var startPos = GameManager.instance.State.GameState.SpawnPoints[RoundManager.instance.State.SelectedSpawnPoint];
    _enemy.getXform().setXPos(startPos.x);
    _enemy.getXform().setYPos(startPos.y);
    this.EnemySet.addToSet(_enemy);
  }

  instantiateWaypoint(pos) {
    this.WaypointSet.addToSet(new Waypoint(pos));
  }

  instantiateTower(pos) {
    this.TowerSet.addToSet(new Tower(pos, this.EnemySet));
  }

  enemyDied(e) {
    this.EnemySet.removeFromSet(e);
    RoundManager.instance.enemyKilled();
  }

  _initializeStartPoints() {
    var spawns = GameManager.instance.State.GameState.SpawnPoints;
    spawns.forEach((s, i) => this.SpawnPointSet.addToSet(new SpawnPoint(s, i)));
  }

  _initializeEndPoints() {
    var ends = GameManager.instance.State.GameState.EndPoints;
    ends.forEach((f, i) => this.EndPointSet.addToSet(new EndPoint(f, i)));
  }

  _cleanupRound() {
    this.EnemySet.removeAll();
    this.WaypointSet.removeAll();
    this.TowerSet.removeAll();
  }
}
