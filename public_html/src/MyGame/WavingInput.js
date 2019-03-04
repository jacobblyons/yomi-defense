class WavingInput {
  constructor(sceneRef) {
    this.mousePos = this._updateMousePos();
    this.enabled = false;
    this.sceneRef = sceneRef;
    RoundManager.instance.OnWavingPlayerStart.subscribe(this._onStart.bind(this));
    RoundManager.instance.OnWavingPlayerEnd.subscribe(this._onEnd.bind(this));
  }

  update() {
    if (!this.enabled) return;
    this._updateMousePos();
    if (gEngine.Input.isButtonClicked(0)) this._handleClick();
  }

  _onStart() {
    this.enabled = true;
  }

  _onEnd() {
    this.enabled = false;
  }

  _handleClick() {
    var waypointLimit = RoundManager.instance.State.WaypointLimit;
    var waypoints = RoundManager.instance.State.Waypoints;
    var selectedSpawn = RoundManager.instance.State.SelectedSpawnPoint;
    var selectedEnd = RoundManager.instance.State.SelectedEndPoint;

    if (selectedSpawn === -1) this._handleSpawnSelect();
    else if (selectedEnd === -1) this._handleEndSelect();
    else if (waypoints.length < waypointLimit) this._handleWaypointSelect();
    else RoundManager.instance.wavingPlayerFinished();
  }

  _handleSpawnSelect() {
    this.sceneRef.SpawnPointSet.mSet.forEach(s => {
      if (s.isIntersection(this.mousePos)) {
        RoundManager.instance.selectSpawn(s.id);
      }
    });
  }

  _handleEndSelect() {
    this.sceneRef.EndPointSet.mSet.forEach(e => {
      if (e.isIntersection(this.mousePos)) {
        RoundManager.instance.selectEnd(e.id);
      }
    });
  }

  _handleWaypointSelect() {
    this.sceneRef.instantiateWaypoint(this.mousePos);
    RoundManager.instance.addWaypoint(this.mousePos);
  }

  _updateMousePos() {
    this.mousePos = GameManager.instance.getMouseWorldCoordinates();
  }
}
