class HUD {
  constructor() {
    var canvas = document.getElementById("GLCanvas");
    this.gm = GameManager.instance;
    this.mLargeMessage = new UIText(
      "",
      [canvas.width / 2, canvas.height / 2 + 290],
      GameManager.instance.State.AppState.HUDTextSize * 2,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );
    this.mSubtitle = new UIText(
      "IN GAME",
      [canvas.width / 2, canvas.height / 2 + 255],
      GameManager.instance.State.AppState.HUDTextSize,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, 1, 1, 1]
    );

    this.mPlayerOneScore = new UIText(
      `P1 SCORE: 0`,
      [canvas.width / 2 - 320, canvas.height / 2 + 275],
      GameManager.instance.State.AppState.HUDTextSize,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [0, 1, 1, 1]
    );

    this.mPlayerTwoScore = new UIText(
      `P2 SCORE: 0`,
      [canvas.width / 2 + 320, canvas.height / 2 + 275],
      GameManager.instance.State.AppState.HUDTextSize,
      UIText.eHAlignment.eCenter,
      UIText.eVAlignment.eTop,
      [1, .08, .57, 1]
    );

    this.mPlayerOneBaseNumbers = [];
    this.mPlayerTwoBaseNumbers = [];

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
    RoundManager.instance.OnScoreChanged.subscribe(this.updateScore.bind(this));
  }

  draw(cam) {
    this.mSubtitle.draw(cam);
    this.mLargeMessage.draw(cam);
    this.mPlayerOneBaseNumbers.forEach(n => n.draw(cam));
    this.mPlayerTwoBaseNumbers.forEach(n => n.draw(cam));
    this.mPlayerOneScore.draw(cam);
    this.mPlayerTwoScore.draw(cam);
  }
  update() {}

  showRoundMessage() {
    this.mLargeMessage.setText("BEGIN ROUND");
    this.mSubtitle.setText("Press space...");
  }

  showWavingReadyUpMessage() {
    this.mLargeMessage.setText(
      GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Waving ? "PLAYER ONE" : "PLAYER TWO"
    );
    this.mLargeMessage.setColor(
      GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Waving ? [0, 1, 1, 1] : [1, .08, .57, 1]
    );
    this.mSubtitle.setText("Press space to start...");
  }

  showWavingPickSpawnMessage() {
    this.mSubtitle.setText("Press 1, 2, or 3 to select a SPAWN POINT...");
    //show numbers
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    if (p1Role === PlayerRole.Waving) this._createPlayerOneNumbers();
    else this._createPlayerTwoNumbers();
  }

  showWavingPickEndMessage() {
    this.mSubtitle.setText("Press 1, 2, or 3 to select a GOAL POINT...");

    //show numbers
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    if (p1Role === PlayerRole.Vaping) {
      this.mPlayerTwoBaseNumbers = [];
      this._createPlayerOneNumbers();
    } else {
      this.mPlayerOneBaseNumbers = [];
      this._createPlayerTwoNumbers();
    }
  }

  showWavingInstructionMessage() {
    this.mPlayerTwoBaseNumbers = [];
    this.mPlayerOneBaseNumbers = [];
    this.mSubtitle.setText("(WAVING) Click to set waypoints (LMB=Real,RMB=Fake). Press space when done.");
  }

  showVapingReadyUpMessage() {
    this.mLargeMessage.setText(
      GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Vaping ? "PLAYER ONE" : "PLAYER TWO"
    );
    this.mLargeMessage.setColor(
      GameManager.instance.State.GameState.PlayerOne.Role === PlayerRole.Vaping ? [0, 1, 1, 1] : [1, .08, .57, 1]
    );
    this.mSubtitle.setText("Press space to start ");
  }

  showVapingInstructionMessage() {
    this.mSubtitle.setText("(VAPING) Click to set towers. Press space when done.");
  }

  showWave() {
    this.mLargeMessage.setText(`ROUND ${GameManager.instance.State.GameState.CurrentRound}`);
    this.mSubtitle.setText("WAVE Incoming...!");
  }

  clearMessage() {
    this.mSubtitle.setText("");
  }

  updateScore() {
    this.mPlayerOneScore.setText(`P1 SCORE: ${this.gm.State.GameState.PlayerOne.Score}`);
    this.mPlayerTwoScore.setText(`P2 SCORE: ${this.gm.State.GameState.PlayerTwo.Score}`);
  }

  _createPlayerOneNumbers() {
    var bases = this.gm.State.GameState.PlayerOne.Bases;
    Object.keys(bases).forEach((key, i) => {
      var coord = this.gm.getCanvasCoordinates(bases[key]);
      this.mPlayerOneBaseNumbers.push(
        new UIText(
          `${i + 1}`,
          [coord.x, coord.y + 7],
          GameManager.instance.State.AppState.HUDTextSize,
          UIText.eHAlignment.eCenter,
          UIText.eVAlignment.eTop,
          [1, 1, 1, 1]
        )
      );
    });
  }

  _createPlayerTwoNumbers() {
    var bases = this.gm.State.GameState.PlayerTwo.Bases;
    Object.keys(bases).forEach((key, i) => {
      var coord = this.gm.getCanvasCoordinates(bases[key]);
      this.mPlayerTwoBaseNumbers.push(
        new UIText(
          `${i + 1}`,
          [coord.x, coord.y + 7],
          GameManager.instance.State.AppState.HUDTextSize,
          UIText.eHAlignment.eCenter,
          UIText.eVAlignment.eTop,
          [1, 1, 1, 1]
        )
      );
    });
  }
}
