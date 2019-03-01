class RoundManager {
  static instance;
  constructor() {
    if (RoundManager.instance) return RoundManager.instance;
    RoundManager.instance = this;
    //events
    this.OnRoundStart = new GameEvent();
    this.OnRoundEnd = new GameEvent();
    this.OnRoundMessageShow = new GameEvent();
    this.OnRoundMessageHide = new GameEvent();
    this.OnVapingPlayerReadyUpShow = new GameEvent();
    this.OnVapingPlayerReadyUpHide = new GameEvent();
    this.OnVapingPlayerStart = new GameEvent();
    this.OnVapingPlayerEnd = new GameEvent();
    this.OnWavingPlayerReadyUpShow = new GameEvent();
    this.OnWavingPlayerReadyUpHide = new GameEvent();
    this.OnWavingPlayerStart = new GameEvent();
    this.OnWavingPlayerEnd = new GameEvent();
    this.OnWaveStart = new GameEvent();
    this.OnWaveEnd = new GameEvent();
  }

  //meant to be called by GameManager after menu
  startRound() {
    this.OnRoundStart.dispatch();
    this.OnRoundMessageShow.dispatch();
  }

  readyForRound() {
    console.log("round ready");
    GameManager.instance.State.RoundState.Turn = Turn.WavingReadyUp;
    this.OnRoundMessageHide.dispatch();
    this.OnWavingPlayerReadyUpShow.dispatch();
  }
  vapingPlayerReady() {
    console.log("vaping ready");
  }
  vapingPlayerFinished() {}
  wavingPlayerReady() {
    console.log("waving ready");
  }
  wavingPlayerFinished() {}
  enemyKilled() {}
}
