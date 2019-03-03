"use strict";

class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.gm = GameManager.instance;
    this.mWavingInput = null;
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
    this.mHUD = new HUD();
    this.EnemySet = new GameObjectSet();
    this.TowerSet = new GameObjectSet();
    this.WaypointSet = new GameObjectSet();

    this.enemy = new Enemy();
  }

  instantiateEnemy() {}
  instantiateWaypoint(pos) {
    this.WaypointSet.addToSet(new Waypoint(pos));
  }

  update() {
    this.mWavingInput.update();
    this.mHUD.update();
    this.enemy.update();
    this.WaypointSet.update();
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
    this.enemy.draw(this.mCam);
    this.WaypointSet.draw(this.mCam);
  }
}
