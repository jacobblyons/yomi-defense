class GameManager {
  static instance;
  constructor() {
    //class singleton implementation
    if (GameManager.instance) return GameManager.instance;
    GameManager.instance = this;

    //properties
    this.State = new State();
    this.mGameScene = new MyGame();
    this.mMenuScene = new Menu();
    //events

    //logging
    setInterval(() => {
      document.getElementById("state-debug").innerHTML = this.State.toString();
    }, 100);
  }

  startGame() {
    if (this.State.AppState.Executing !== Executing.Game) {
      this.State.AppState.Executing = Executing.Game;
      gEngine.GameLoop.stop();
    }
  }

  sceneSwapReady() {
    if (this.State.AppState.Executing == Executing.Game) {
      gEngine.Core.startScene(this.mGameScene);
      RoundManager.instance.startRound();
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
}
