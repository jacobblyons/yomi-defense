class WavingInput {
  constructor(sceneRef) {
    this.mousePos = this._updateMousePos();
    this.enabled = false;
    this.sceneRef = sceneRef;
    this.doneSettingWaypoints = false;
    RoundManager.instance.OnWavingPlayerStart.subscribe(this._onStart.bind(this));
    RoundManager.instance.OnWavingPlayerEnd.subscribe(this._onEnd.bind(this));
  }

  update() {
    if (!this.enabled) return;

    //handle start and end
    var selectedSpawn = RoundManager.instance.State.SelectedSpawnBase;
    var selectedEnd = RoundManager.instance.State.SelectedEndBase;
    if (selectedSpawn === BaseID.Unselected) this._handleSpawnSelect();
    else if (selectedEnd === BaseID.Unselected) this._handleEndSelect();

    //hanlde clicks
    this._updateMousePos();
    if (gEngine.Input.isButtonClicked(0)) this._handleClick(true);
    if (gEngine.Input.isButtonClicked(2)) this._handleClick(false);

    //x to stop placing waypoints early
    if (selectedEnd != BaseID.Unselected && gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
      this.doneSettingWaypoints = true;
      RoundManager.instance.wavingPlayerFinished();
      this.doneSettingWaypoints = false;
    }
  }

  _onStart() {
    this.enabled = true;
  }

  _onEnd() {
    this.enabled = false;
  }

  _handleClick(real) {
    var selectedEnd = RoundManager.instance.State.SelectedEndBase;
    if (selectedEnd == BaseID.Unselected) return;

    var waypointLimit = RoundManager.instance.State.WaypointLimit;
    var waypoints = RoundManager.instance.State.Waypoints;

    if (waypoints.length < waypointLimit && !this.doneSettingWaypoints) this._handleWaypointSelect(real);
    else {
      RoundManager.instance.wavingPlayerFinished();
      this.doneSettingWaypoints = false;
    }
  }

  _handleSpawnSelect() {
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    // keys
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
      RoundManager.instance.selectSpawn(p1Role === PlayerRole.Waving ? BaseID.P1.One : BaseID.P2.One);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
      RoundManager.instance.selectSpawn(p1Role === PlayerRole.Waving ? BaseID.P1.Two : BaseID.P2.Two);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
      RoundManager.instance.selectSpawn(p1Role === PlayerRole.Waving ? BaseID.P1.Three : BaseID.P2.Three);
    }
  }

  _handleEndSelect() {
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    // keys
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
      RoundManager.instance.selectEnd(p1Role === PlayerRole.Vaping ? BaseID.P1.One : BaseID.P2.One);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
      RoundManager.instance.selectEnd(p1Role === PlayerRole.Vaping ? BaseID.P1.Two : BaseID.P2.Two);
    } else if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
      RoundManager.instance.selectEnd(p1Role === PlayerRole.Vaping ? BaseID.P1.Three : BaseID.P2.Three);
    }
  }

  _handleWaypointSelect(real) {
    this.sceneRef.instantiateWaypoint(this.mousePos);
    if (real) RoundManager.instance.addWaypoint(this.mousePos);
    else {
      RoundManager.instance.addFakeWaypoint(this.mousePos);
    }
  }

  _updateMousePos() {
    this.mousePos = GameManager.instance.getMouseWorldCoordinates();
  }
}
