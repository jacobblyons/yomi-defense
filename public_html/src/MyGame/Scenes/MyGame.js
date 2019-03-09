"use strict";

class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.gm = GameManager.instance;
    //this.gm.init();
    this.mWavingInput = null;
    this.mVapingInput = null;
    this.HUD = null;
    this.EnemySet = null;
    this.TowerSet = null;
    this.enemy = null;
    this.kTexture = "assets/SpriteSheet.png";
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
  }
  draw() {
    this.mCam.setupViewProjection();

    this.BG.draw(this.mCam);
    //this.enemy.draw(this.mCam);
    this.EnemySet.draw(this.mCam);
    this.WaypointSet.draw(this.mCam);
    this.TowerSet.draw(this.mCam);
    this.PlayerOneBaseSet.draw(this.mCam);
    this.PlayerTwoBaseSet.draw(this.mCam);
    this.mHUD.draw(this.mCam);
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
    this.WaypointSet.addToSet(new Waypoint(pos, this.kTexture));
  }

  instantiateTower(pos) {
    this.TowerSet.addToSet(new Tower(pos, this.EnemySet, this.kTexture));
  }

  enemyAtEndPoint(e) {
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
  }
}
