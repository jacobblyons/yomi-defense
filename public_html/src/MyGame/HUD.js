class HUD {
  constructor() {
    var canvas = document.getElementById("GLCanvas");
    this.mLargeMessage = new UIText(
      "",
      [canvas.width / 2, canvas.height / 2 + 250],
      GameManager.instance.State.AppState.HUDTextSize *2,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );
    this.mSubtitle = new UIText(
      "IN GAME",
      [canvas.width / 2, canvas.height / 2 + 215],
      GameManager.instance.State.AppState.HUDTextSize,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );

    //subscriptions
    RoundManager.instance.OnRoundMessageShow.subscribe(this.showRoundMessage.bind(this));
    RoundManager.instance.OnRoundMessageHide.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnVapingPlayerReadyUpShow.subscribe(this.showVapingReadyUpMessage.bind(this));
    RoundManager.instance.OnVapingPlayerReadyUpHide.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnWavingPlayerReadyUpShow.subscribe(this.showWavingReadyUpMessage.bind(this));
    RoundManager.instance.OnWavingPlayerReadyUpHide.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnWavingPlayerStart.subscribe(this.showWavingPickSpawnMessage.bind(this));
    RoundManager.instance.OnSpawnPointSelected.subscribe(this.showWavingPickEndMessage.bind(this));
    RoundManager.instance.OnEndPointSelected.subscribe(this.showWavingInstructionMessage.bind(this));
    RoundManager.instance.OnWavingPlayerEnd.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnVapingPlayerStart.subscribe(this.showVapingInstructionMessage.bind(this));
    RoundManager.instance.OnVapingPlayerEnd.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnWaveStart.subscribe(this.showWave.bind(this));    
  }

  draw(cam) {
    this.mSubtitle.draw(cam);
    this.mLargeMessage.draw(cam);
  }
  update() {}

  showRoundMessage() {
    this.mLargeMessage.setText("ROUND BEGIN");
    this.mSubtitle.setText("press space...");
  }
  showWavingReadyUpMessage() {
    this.mLargeMessage.setText(GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Waving ? "PLAYER ONE" : "PLAYER TWO");
    this.mSubtitle.setText("press space to start ");
  }
  showWavingPickSpawnMessage() {
    this.mSubtitle.setText("select a SPAWN...");
  }
  showWavingPickEndMessage() {
    this.mSubtitle.setText("select an END...");
  }
  showWavingInstructionMessage() {
    this.mSubtitle.setText("(WAVING) Click to set waypoints. x to finish.");
  }
  showVapingReadyUpMessage() {
    this.mLargeMessage.setText(GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Vaping ? "PLAYER ONE" : "PLAYER TWO");
    this.mSubtitle.setText("press space to start ");
  }
  showVapingInstructionMessage(){
    this.mSubtitle.setText("(VAPING) Click to set towers. x to finish.");
  }
  showWave(){
    this.mLargeMessage.setText( `WAVE ${GameManager.instance.State.RoundState.CurrentWave}` );
    this.mSubtitle.setText("Wave running...");
  }
  clearMessage() {
    
    this.mSubtitle.setText("");
  }

  
}
