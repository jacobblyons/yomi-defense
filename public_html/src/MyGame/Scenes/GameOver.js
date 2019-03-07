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
    this.mCam.setBackgroundColor([0.2, 0.2, 0.2, 1]);
    this.mPlayAgainButton = new UIButton(
      this.kButtonSprite,
      () => {
        GameManager.instance.restartGame();
      },
      this,
      [canvas.width / 2, canvas.height / 2 - 100],
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
      [canvas.width / 2, canvas.height / 2 + 100],
      10,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );
  }
  update() {
    this.mPlayAgainButton.update();
  }
  draw() {
    this.mCam.setupViewProjection();
    this.mPlayAgainButton.draw(this.mCam);
    this.mWinnerMessage.draw(this.mCam);
  }
}
