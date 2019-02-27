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
    this.OnRoundStart = new GameEvent();
    this.OnRoundEnd = new GameEvent();
    this.OnRoundStart = new GameEvent();

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

  startRound() {}

  sceneSwapReady() {
    if (this.State.AppState.Executing == Executing.Game) {
      gEngine.Core.startScene(this.mGameScene);
      this.OnRoundStart.dispatch();
    }
  }
}
