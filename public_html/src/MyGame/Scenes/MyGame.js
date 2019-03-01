"use strict";

class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.mWaypointInput = null;
    this.HUD = null;
  }

  loadScene() {}
  unloadScene() {}
  initialize() {
    var canvas = document.getElementById("GLCanvas");
    this.mCam = new Camera(
      vec2.fromValues(50, 50), // position of the camera
      200, // width of camera
      [0, 0, canvas.width, canvas.height] // viewport (orgX, orgY, width, height)
    );
    this.mCam.setBackgroundColor([0.2, 0.2, 0.2, 1]);

    this.mWaypointInput = new WaypointInput();
    this.mHUD = new HUD();
  }
  update() {
    this.mWaypointInput.update();
    this.mHUD.update();

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
  }
  draw() {
    this.mCam.setupViewProjection();
    this.mHUD.draw(this.mCam);
  }
}
