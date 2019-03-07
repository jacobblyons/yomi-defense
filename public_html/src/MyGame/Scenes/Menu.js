class Menu extends Scene {
  constructor() {
    super();
    this.kButtonSprite = "assets/UI/button.png";
    this.mGameTitle = "YOMI DEFENSE";
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

    this.mPlay3RoundsButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(3);
      },
      this,
      [canvas.width / 2 - 250, canvas.height / 2 - 100],
      [150, 75],
      "3 Rounds",
      6,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mPlay5RoundsButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(5);
      },
      this,
      [canvas.width / 2, canvas.height / 2 - 100],
      [150, 75],
      "5 Rounds",
      6,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mPlayInfiniteButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(-1);
      },
      this,
      [canvas.width / 2 + 250, canvas.height / 2 - 100],
      [150, 75],
      "Infinite",
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
    this.mPlay3RoundsButtonUI.update();
    this.mPlay5RoundsButtonUI.update();
    this.mPlayInfiniteButtonUI.update();
  }
  draw() {
    this.mCam.setupViewProjection();
    this.mPlay3RoundsButtonUI.draw(this.mCam);
    this.mPlay5RoundsButtonUI.draw(this.mCam);
    this.mPlayInfiniteButtonUI.draw(this.mCam);
    this.mGameTitleTextUI.draw(this.mCam);
  }
}
