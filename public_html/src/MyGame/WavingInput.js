class WavingInput {
  constructor() {
    this.mousePos = this._updateMousePos();
    this.enabled = false;
    //this is just for testing. should be an event from roundmanager or something
    RoundManager.instance.OnWavingPlayerStart.subscribe(this.onStart.bind(this));
    RoundManager.instance.OnWavingPlayerEnd.subscribe(this.onEnd.bind(this));
  }

  update() {
    if (!this.enabled) return;
    this._updateMousePos();
    if (gEngine.Input.isButtonClicked(0)) {
      console.log("clicked key at:", this.mousePos.x, this.mousePos.y);
    }
  }

  onStart() {
    this.enabled = true;
    console.log("started");
  }

  onEnd() {
    this.enabled = false;
  }

  _updateMousePos() {
    this.mousePos = new Vector2(gEngine.Input.getMousePosX(), gEngine.Input.getMousePosY());
  }
}
