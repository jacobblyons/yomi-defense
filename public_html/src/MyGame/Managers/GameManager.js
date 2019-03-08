class GameManager {
  /**@type {GameManager} */
  static instance;
  constructor() {
    //class singleton implementation
    if (GameManager.instance) return GameManager.instance;
    GameManager.instance = this;

    //properties
    this.State = new State();
    this.mGameScene = new MyGame();
    this.mMenuScene = new Menu();
    this.mGameOverScene = new GameOver();
    this.showState = true;

    //events
    //logging
    setInterval(() => {
      document.getElementById("state-debug").innerHTML = this.State.toString();
    }, 100);
  }

  startGame(rounds) {
    this.State.GameState.Rounds = rounds;
    this.State.AppState.Executing = Executing.Game;
    gEngine.GameLoop.stop();
  }

  restartGame() {
    this.State.AppState.Executing = Executing.Menu;
    this.State = new State(); //cleanup
    RoundManager.instance.State = this.State.RoundState;
    gEngine.GameLoop.stop();
  }

  endGame() {
    this.State.AppState.Executing = Executing.GameOver;
    gEngine.GameLoop.stop();
  }

  sceneSwapReady() {
    if (this.State.AppState.Executing == Executing.Game) {
      gEngine.Core.startScene(this.mGameScene);
      RoundManager.instance.startRound();
    } else if (this.State.AppState.Executing == Executing.Menu) {
      gEngine.Core.startScene(this.mMenuScene);
    } else if (this.State.AppState.Executing == Executing.GameOver) {
      gEngine.Core.startScene(this.mGameOverScene);
    }
  }

  getMouseWorldCoordinates() {
    var AppState = GameManager.instance.State.AppState;
    var mouseCoordinates = new Vector2(gEngine.Input.getMousePosX(), gEngine.Input.getMousePosY());
    var multiplier = AppState.CameraWidth / AppState.CanvasWidth;
    var lowerLeft = new Vector2(
      AppState.CameraCenter.x - AppState.CameraWidth / 2,
      AppState.CameraCenter.y - (AppState.CanvasHeight * multiplier) / 2
    );
    var worldCoordinates = new Vector2(
      mouseCoordinates.x * multiplier + lowerLeft.x,
      mouseCoordinates.y * multiplier + lowerLeft.y
    );
    return worldCoordinates;
  }

  getCanvasCoordinates(worldCoordinates) {
    var AppState = GameManager.instance.State.AppState;
    var multiplier = AppState.CameraWidth / AppState.CanvasWidth;
    var lowerLeft = new Vector2(
      AppState.CameraCenter.x - AppState.CameraWidth / 2,
      AppState.CameraCenter.y - (AppState.CanvasHeight * multiplier) / 2
    );

    return new Vector2((worldCoordinates.x - lowerLeft.x) / multiplier, (worldCoordinates.y - lowerLeft.y) / multiplier);
  }

  _toggleStateDebug() {
    this.showState = !this.showState;
  }
}
