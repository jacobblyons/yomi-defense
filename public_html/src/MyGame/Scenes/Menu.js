class Menu extends Scene {
  constructor() {
    super();
    this.kButtonSprite = "assets/UI/button.png";
    this.mGameTitle = "YOMI DEFENSE";    
    this.mPlayButtonUI = null;
    this.mExitButtonUI = null;
    this.mShowDebug = null;
    this.mGameTitleTextUI = null;
    this.mCam = null;
    this.showRules = false;
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
    this.mCam.setBackgroundColor([0, 0, 0, 1]);
    this.mRules = new SpriteRenderable("assets/RuleSheet.png");
    this.mRules.setElementPixelPositions(0,2040,0,2048);
    this.mRules.getXform().setSize(200,200);
    this.mRules.getXform().setPosition(100,90);
    
    this.mPlay3RoundsButtonUI = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.startGame(3);
      },
      this,
      [canvas.width / 2 - 250, canvas.height / 2 - 175],
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
      [canvas.width / 2, canvas.height / 2 - 175],
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
      [canvas.width / 2 + 250, canvas.height / 2 - 175],
      [150, 75],
      "Infinite",
      6,
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

    this.mShowDebug = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.toggleStateDebug();
      },
      this,
      [canvas.width / 2 + 300, canvas.height / 2 + 250],
      [75, 50],
      "DEBUG",
      4,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );
    var v = gEngine.DefaultResources.getGlobalAmbientColor();
    v[0] = 1;
    v[1] = 1;
    v[2] = 1;
  }
  
  update() {
    this.mPlay3RoundsButtonUI.update();
    this.mPlay5RoundsButtonUI.update();
    this.mPlayInfiniteButtonUI.update();
    this.mShowDebug.update();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        this.showRules = true;
    }else{
        this.showRules = false;       
    }
  }
  
  draw() {
    this.mCam.setupViewProjection();
    if(this.showRules){
        this.mRules.draw(this.mCam);
    }   
    this.mPlay3RoundsButtonUI.draw(this.mCam);
    this.mPlay5RoundsButtonUI.draw(this.mCam);
    this.mPlayInfiniteButtonUI.draw(this.mCam);
    this.mGameTitleTextUI.draw(this.mCam);
    this.mShowDebug.draw(this.mCam);
  }
}
