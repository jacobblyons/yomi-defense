class GameOver extends Scene {
  constructor() {
    super();
    this.kButtonSprite = "assets/UI/button.png";
    this.mPlayAgainButton = null;
    this.mCam = null;
    this.mWinnerMessage = null;
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
    this.mPlayAgainButton = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.restartGame();
      },
      this,
      [canvas.width / 2, canvas.height / 2 - 175],
      [150, 75],
      "Play Again",
      6,
      [1, 0, 0, 1],
      [1, 1, 1, 1]
    );

    this.mWinnerMessage = new UIText(
      `${
        GameManager.instance.State.GameState.PlayerOne.Score > GameManager.instance.State.GameState.PlayerTwo.Score
          ? "PLAYER ONE WINS"
          : GameManager.instance.State.GameState.PlayerOne.Score === GameManager.instance.State.GameState.PlayerTwo.Score
          ? "DRAW"
          : "PLAYER TWO WINS"
      }`,
      [canvas.width / 2, canvas.height / 2 - 95],
      10,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );
  }
  update() {
    this.mPlayAgainButton.update();
    var v = gEngine.DefaultResources.getGlobalAmbientColor();
    v[0] = 1;
    v[1] = 1;
    v[2] = 1;
  }
  draw() {
    this.mCam.setupViewProjection();    
    this.mRules.draw(this.mCam);    
    this.mPlayAgainButton.draw(this.mCam);
    this.mWinnerMessage.draw(this.mCam);
  }
}