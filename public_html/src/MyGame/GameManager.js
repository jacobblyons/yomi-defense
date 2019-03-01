class GameManager {
  static instance;
  constructor() {
    //class singleton implementation
    if (GameManager.instance) return GameManager.instance;
    console.log("new instance");
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
}
