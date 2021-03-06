class Menu extends Scene {
  constructor() {
    super();
    this.kButtonSprite = "assets/UI/button.png";
    this.mGameTitle = "YOMI DEFENSE";
    this.mPlayButtonUI = null;
    this.mExitButtonUI = null;
    this.mGameTitleTextUI = null;
    this.mCam = null;
    this.mShowInstructionText = null;
    this.kBGAudio = "assets/audio/Organ.wav";
  }

  loadScene() {
    gEngine.Textures.loadTexture(this.kButtonSprite);
    gEngine.AudioClips.loadAudio(this.kBGAudio);
  }
  unloadScene() {
    gEngine.AudioClips.stopBackgroundAudio();
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
    this.mCam.setBackgroundColor([0, 0, 0, 1]);
    this.mRules = new SpriteRenderable("assets/RuleSheet.png");
    this.mRules.setElementPixelPositions(0, 2040, 0, 2048);
    this.mRules.getXform().setSize(200, 200);
    this.mRules.getXform().setPosition(100, 90);

    this.mPlay3RoundsButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(3);
      },
      this,
      [canvas.width / 2 - 200, canvas.height / 2 - 200],
      [150, 60],
      "3 Rounds",
      5,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mPlay5RoundsButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(5);
      },
      this,
      [canvas.width / 2, canvas.height / 2 - 200],
      [150, 60],
      "5 Rounds",
      5,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mPlayInfiniteButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(-1);
      },
      this,
      [canvas.width / 2 + 200, canvas.height / 2 - 200],
      [150, 60],
      "Infinite",
      5,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mGameTitleTextUI = new UIText(
      this.mGameTitle,
      [canvas.width / 2, canvas.height / 2 - 95],
      10,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );


//    this.mShowInstructionText = new UIText(
//      "HOLD SPACE FOR INSTRUCTIONS",
//      [canvas.width / 2, canvas.height / 2 - 250],
//      5,
//      UIText.eHAlignment.eCenter,
//      UIText.eVAlignment.eTop,
//      [1, 1, 1, 1]
//    );

    var v = gEngine.DefaultResources.getGlobalAmbientColor();
    v[0] = 1;
    v[1] = 1;
    v[2] = 1;
    gEngine.AudioClips.playBackgroundAudio(this.kBGAudio);
  }

  update() {
    this.mPlay3RoundsButtonUI.update();
    this.mPlay5RoundsButtonUI.update();
    this.mPlayInfiniteButtonUI.update();
  }

  draw() {
    this.mCam.setupViewProjection();
    this.mRules.draw(this.mCam);
    this.mPlay3RoundsButtonUI.draw(this.mCam);
    this.mPlay5RoundsButtonUI.draw(this.mCam);
    this.mPlayInfiniteButtonUI.draw(this.mCam);
    this.mGameTitleTextUI.draw(this.mCam);
  }
}
