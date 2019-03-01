class HUD {
  constructor() {
    var canvas = document.getElementById("GLCanvas");
    this.mGameMessage = new UIText(
      "IN GAME",
      [canvas.width / 2, canvas.height / 2 + 100],
      4,
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

    /*    TEST     */
    RoundManager.instance.OnWavingPlayerStart.subscribe(
      (() =>
        this.mGameMessage.setText("insert waving gameplay here. can see waving input in console. x to continue. ")).bind(
        this
      )
    );
    RoundManager.instance.OnWavingPlayerEnd.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnVapingPlayerStart.subscribe(
      (() => this.mGameMessage.setText("insert vaping gameplay here. press x.")).bind(this)
    );
    RoundManager.instance.OnVapingPlayerEnd.subscribe(this.clearMessage.bind(this));
    RoundManager.instance.OnWaveStart.subscribe((() => this.mGameMessage.setText("wave runs here...")).bind(this));
    /*    TEST     */
  }

  draw(cam) {
    this.mGameMessage.draw(cam);
  }
  update() {}

  showRoundMessage() {
    this.mGameMessage.setText("ROUND BEGIN! press space...");
  }
  showVapingReadyUpMessage() {
    this.mGameMessage.setText("Vaping Player press space to start ");
  }
  showWavingReadyUpMessage() {
    this.mGameMessage.setText("Waving Player press space to start ");
  }
  clearMessage() {
    this.mGameMessage.setText("");
  }
}
