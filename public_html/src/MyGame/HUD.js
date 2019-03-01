class HUD {
  constructor() {
    var canvas = document.getElementById("GLCanvas");
    this.mGameMessage = new UIText(
      "IN GAME",
      [canvas.width / 2, canvas.height / 2 + 100],
      8,
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
