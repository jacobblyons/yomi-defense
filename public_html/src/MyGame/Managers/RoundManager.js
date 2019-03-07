class RoundManager {
  /**@type {RoundManager} */
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
    this.OnWaveResultsShow = new GameEvent();
    this.OnWaveResultsHide = new GameEvent();
    this.OnSpawnPointSelected = new GameEvent();
    this.OnEndPointSelected = new GameEvent();
    this.State = GameManager.instance.State.RoundState;
  }

  //meant to be called by GameManager after menu
  startRound() {
    this.OnRoundStart.dispatch();
    this.OnRoundMessageShow.dispatch();
  }

  readyForRound() {
    this.State.Turn = Turn.WavingReadyUp;
    this.OnRoundMessageHide.dispatch();
    this.OnWavingPlayerReadyUpShow.dispatch();
  }

  wavingPlayerReady() {
    this.State.Turn = Turn.Waving;
    this.OnWavingPlayerReadyUpHide.dispatch();
    this.OnWavingPlayerStart.dispatch();
  }

  wavingPlayerFinished() {
    this.State.Turn = Turn.VapingReadyUp;
    this.OnWavingPlayerEnd.dispatch();
    this.OnVapingPlayerReadyUpShow.dispatch();
  }

  vapingPlayerReady() {
    this.State.Turn = Turn.Vaping;
    this.OnVapingPlayerReadyUpHide.dispatch();
    this.OnVapingPlayerStart.dispatch();
  }

  vapingPlayerFinished() {
    this.State.Turn = Turn.RunningWave;
    this.OnVapingPlayerEnd.dispatch();
    this.OnWaveStart.dispatch();
  }

  addWaypoint(pos) {
    this.State.Waypoints.push(pos);
  }

  addFakeWaypoint(pos) {
    this.State.FakeWaypoints.push(pos);
  }

  selectSpawn(s) {
    this.State.SelectedSpawnPoint = s;
    this.OnSpawnPointSelected.dispatch();
  }

  selectEnd(e) {
    this.State.SelectedEndPoint = e;
    this.OnEndPointSelected.dispatch();
  }

  addTower(pos) {
    this.State.Towers.push(pos);
  }

  enemySpawned(){
    this.State.EnemiesSpawned++;
    
  }
  
  enemyKilled() {
    this.State.EnemiesDestroyed++;
    var waveSize = this.State.InitialWaveSize + this.State.InitialWaveSize * (this.State.WaveSizeMultiplier*this.State.CurrentWave);
    if(this.State.EnemiesSpawned == waveSize && this.State.EnemiesDestroyed == waveSize) this._finishRound();
  }
  _finishRound(){
    this.State.Turn = Turn.FinishedWave;
    this.OnRoundEnd.dispatch();
    this.OnWaveResultsShow.dispatch();
    this.OnWaveEnd.dispatch();

    setTimeout(() => {
      this.State.Turn = Turn.WavingReadyUp;
      //reset state
      this.State.SelectedEndPoint = -1;
      this.State.SelectedSpawnPoint = -1;
      this.State.EnemiesSpawned = 0;
      this.State.EnemiesDestroyed = 0;
      this.State.CurrentWave++;
      this.State.Waypoints = [];
      this.State.Turrets = [];
      //swap roles
      GameManager.instance.State.GameState.PlayerOne.Role = GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Vaping ? PlayerRole.Waving : PlayerRole.Vaping;
      GameManager.instance.State.GameState.PlayerTwo.Role = GameManager.instance.State.GameState.PlayerTwo.Role === PlayerRole.Vaping ? PlayerRole.Waving : PlayerRole.Vaping;

      this.OnWaveResultsHide.dispatch();
    this.OnWavingPlayerReadyUpShow.dispatch();
    }, 1000);
  }
}
