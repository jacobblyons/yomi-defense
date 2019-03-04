class Menu extends Scene {
  constructor() {
    super();
    this.kButtonSprite = "assets/UI/button.png";
    this.mGameTitle = "OUR GAME";
    this.mPlayButtonUI = null;
    this.mExitButtonUI = null;
    this.mGameTitleTextUI = null;
    this.mCam = null;
  }

  loadScene() {
    gEngine.Textures.loadTexture(this.kButtonSprite);
  }
  unloadScene() {
    gEngine.Textures.unloadTexture(this.kButtonSprite);
    GameManager.instance.sceneSwapReady();
  }
  initialize() {
    var canvas = document.getElementById("GLCanvas");
    this.mCam = new Camera(
      vec2.fromValues(100, 100), // position of the camera
      200, // width of camera
      [0, 0, canvas.width, canvas.height] // viewport (orgX, orgY, width, height)
    );
    this.mCam.setBackgroundColor([0.2, 0.2, 0.2, 1]);

    this.mPlayButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame();
      },
      this,
      [canvas.width / 2, canvas.height / 2 - 100],
      [150, 75],
      "Play",
      6,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );
    
    this.mExitButtonUI = new UIButton(
      this.kButtonSprite,
      () => {},
      this,
      [canvas.width / 2, canvas.height / 2 - 175],
      [150, 75],
      "Exit",
      6,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mGameTitleTextUI = new UIText(
      this.mGameTitle,
      [canvas.width / 2, canvas.height / 2 + 100],
      10,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );
  }
  update() {
    this.mPlayButtonUI.update();
    this.mExitButtonUI.update();
  }
  draw() {
    this.mCam.setupViewProjection();
    this.mPlayButtonUI.draw(this.mCam);
    this.mExitButtonUI.draw(this.mCam);
    this.mGameTitleTextUI.draw(this.mCam);
  }
}
