class VapingInput {
  constructor(sceneRef) {
    this.mousePos = this._updateMousePos();
    this.enabled = false;
    this.sceneRef = sceneRef;
    RoundManager.instance.OnVapingPlayerStart.subscribe(this._onStart.bind(this));
    RoundManager.instance.OnVapingPlayerEnd.subscribe(this._onEnd.bind(this));
    //subscriptions
  }

  update() {
    if (!this.enabled) return;
    this._updateMousePos();
    if (gEngine.Input.isButtonClicked(0)) this._handleClick();}// {
    //console.log("clicked key at:", this.mousePos.x, this.mousePos.y);
    //}
    //}

  _onStart() {
    this.enabled = true;
  }

  _onEnd() {
    this.enabled = false;
  }

  _handleClick() {
    if(this.sceneRef.instantiateTower(this.mousePos)){
      RoundManager.instance.addTower(this.mousePos);
    }
  }

  _updateMousePos() {
    this.mousePos = GameManager.instance.getMouseWorldCoordinates();
    //this.mousePos = new Vector2(gEngine.Input.getMousePosX(), gEngine.Input.getMousePosY());
  }
}
