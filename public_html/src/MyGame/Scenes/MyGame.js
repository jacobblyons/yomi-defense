"use strict";

class MyGame extends Scene {
  constructor() {
    super();
    this.mCam = null;
    this.mGameTitleTextUI = null;
    this.mWaypointInput = null;
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

    this.mGameTitleTextUI = new UIText(
      "IN GAME",
      [canvas.width / 2, canvas.height / 2 + 100],
      10,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );

    this.mWaypointInput = new WaypointInput();
  }
  update() {
    this.mWaypointInput.update();
  }
  draw() {
    this.mCam.setupViewProjection();
    this.mGameTitleTextUI.draw(this.mCam);
  }
}
