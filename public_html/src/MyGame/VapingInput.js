class WavingInput {
  constructor() {
    this.mousePos = this._updateMousePos();
    this.enabled = false;

    //subscriptions
  }

  update() {
    if (!this.enabled) return;
    this._updateMousePos();
    if (gEngine.Input.isButtonClicked(0)) {
      console.log("clicked key at:", this.mousePos.x, this.mousePos.y);
    }
  }

  _onStart() {
    this.enabled = true;
  }

  _onEnd() {
    this.enabled = false;
  }

  _updateMousePos() {
    this.mousePos = new Vector2(gEngine.Input.getMousePosX(), gEngine.Input.getMousePosY());
  }
}
