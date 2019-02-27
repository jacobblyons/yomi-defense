class GameManager {
  static instance;
  constructor() {
    //class singleton implementation
    if (this.instance) return this.instance;
    this.instance = this;

    //properties
    this.State = new State();
    this.mGameScene = new MyGame();
    this.mMenuScene = new Menu();
    //events
    this.OnGameStart = new GameEvent();
    this.OnGameEnd = new GameEvent();
    this.OnRoundStart = new GameEvent();
  }

  startGame() {
    if (this.State.AppState.Executing !== Executing.Game) {
      this.OnGameStart.dispatch();
      gEngine.GameLoop.stop();
    }
  }

  sceneSwapReady() {
    if (this.State.AppState.Executing === Executing.Menu) {
      gEngine.Core.startScene(this.mGameScene);
      this.State.AppState.Executing = Executing.Game;
    }
  }
}
