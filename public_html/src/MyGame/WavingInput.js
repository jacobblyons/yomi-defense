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
    this.sceneRef.instantiateWaypoint(this.mousePos);
    RoundManager.instance.addWaypoint(this.mousePos);
  }

  _updateMousePos() {
    this.mousePos = GameManager.instance.getMouseWorldCoordinates();
  }
}
