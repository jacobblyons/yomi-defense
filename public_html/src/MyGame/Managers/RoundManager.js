class RoundManager {
  /**@type {RoundManager} */
  static instance;
  constructor() {
    if (RoundManager.instance) return RoundManager.instance;
    RoundManager.instance = this;
    /**@type {GameManager} */
    this.gm = GameManager.instance;
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
    this.OnScoreChanged = new GameEvent();
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
    var canPlace = true;
    for (var i = 0; i < this.State.Waypoints.length; i++){        
        var WPPos = this.State.Waypoints[i];
        var dist = Math.sqrt(Math.pow(WPPos.x-pos.x, 2) + Math.pow(WPPos.y-pos.y, 2));
        if (dist < 5){
            canPlace = false;
        }
    }
    for (var i = 0; i < this.State.FakeWaypoints.length; i++){        
        var WPPos = this.State.FakeWaypoints[i];
        var dist = Math.sqrt(Math.pow(WPPos.x-pos.x, 2) + Math.pow(WPPos.y-pos.y, 2));
        if (dist < 5){
            canPlace = false;
        }
    }
    if (canPlace){
        this.State.Waypoints.push(pos);
    }
  }

  addFakeWaypoint(pos) {
    var canPlace = true;
    for (var i = 0; i < this.State.Waypoints.length; i++){
        var dist = 0;
        var WPPos = this.State.Waypoints[i];
        dist = Math.sqrt(Math.pow(WPPos.x-pos.x, 2) + Math.pow(WPPos.y-pos.y, 2));
        if (dist < 5){
            canPlace = false;
        }
    }
    for (var i = 0; i < this.State.FakeWaypoints.length; i++){
        var dist = 0;
        var WPPos = this.State.FakeWaypoints[i];
        dist = Math.sqrt(Math.pow(WPPos.x-pos.x, 2) + Math.pow(WPPos.y-pos.y, 2));
        if (dist < 5){
            canPlace = false;
        }
    }
    if (canPlace){
    this.State.FakeWaypoints.push(pos);
    }
  }

  selectSpawn(s) {
    this.State.SelectedSpawnBase = s;
    this.OnSpawnPointSelected.dispatch();
  }

  selectEnd(e) {
    this.State.SelectedEndBase = e;
    this.OnEndPointSelected.dispatch();
  }

  addTower(pos) {
        this.State.Towers.push(pos);
  }

  enemySpawned() {
    this.State.EnemiesSpawned++;
  }

  enemyKilled() {
    this.State.EnemiesDestroyed++;
    var waveSize =
      this.State.InitialWaveSize + this.State.InitialWaveSize * (this.State.WaveSizeMultiplier * this.State.CurrentWave);
    if (this.State.EnemiesSpawned == waveSize && this.State.EnemiesDestroyed == waveSize) this._finishRound();
  }

  enemyReachedEndPoint() {
    this.State.EnemiesDestroyed++;
    this.gm.State.GameState.PlayerOne.Score += this.gm.State.GameState.PlayerOne.Role == PlayerRole.Waving ? 1 : 0;
    this.gm.State.GameState.PlayerTwo.Score += this.gm.State.GameState.PlayerTwo.Role == PlayerRole.Waving ? 1 : 0;
    this.OnScoreChanged.dispatch();
    var waveSize =
      this.State.InitialWaveSize + this.State.InitialWaveSize * (this.State.WaveSizeMultiplier * this.State.CurrentWave);
    if (this.State.EnemiesSpawned == waveSize && this.State.EnemiesDestroyed == waveSize) this._finishRound();
  }

  _finishRound() {
    this.State.Turn = Turn.FinishedWave;
    this.OnRoundEnd.dispatch();
    this.OnWaveResultsShow.dispatch();
    this.OnWaveEnd.dispatch();
    this.State.CurrentWave++;
    if (this.State.CurrentWave === this.gm.State.GameState.Rounds) {
      return this.gm.endGame();
    }

    setTimeout(() => {
      this.State.Turn = Turn.WavingReadyUp;
      //reset state
      this.State.SelectedEndBase = BaseID.Unselected;
      this.State.SelectedSpawnBase = BaseID.Unselected;
      this.State.EnemiesSpawned = 0;
      this.State.EnemiesDestroyed = 0;

      this.State.Waypoints = [];
      this.State.FakeWaypoints = [];
      this.State.Towers = [];
      //swap roles
      GameManager.instance.State.GameState.PlayerOne.Role =
        GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Vaping ? PlayerRole.Waving : PlayerRole.Vaping;
      GameManager.instance.State.GameState.PlayerTwo.Role =
        GameManager.instance.State.GameState.PlayerTwo.Role === PlayerRole.Vaping ? PlayerRole.Waving : PlayerRole.Vaping;

      this.OnWaveResultsHide.dispatch();
      this.OnWavingPlayerReadyUpShow.dispatch();
    }, 1000);
  }
}
