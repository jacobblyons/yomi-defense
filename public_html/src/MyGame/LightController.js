class LightController {
  constructor(sceneRef) {
    this.sceneRef = sceneRef;
    this.raveColor = [1, 1, 1];

    this.p1Light = new Light();
    this.p1Light.setColor([1, 1, 1, 1]);
    this.p1Light.setXPos(0);
    this.p1Light.setYPos(50);
    this.p1Light.setZPos(10);
    this.p1Light.setNear(30);
    this.p1Light.setFar(50);
    this.p1Light.setIntensity(0.7);
    this.p1Light.setLightTo(false);

    this.p2Light = new Light();
    this.p2Light.setColor([1, 1, 1, 1]);
    this.p2Light.setXPos(100);
    this.p2Light.setYPos(50);
    this.p2Light.setZPos(10);
    this.p2Light.setNear(30);
    this.p2Light.setFar(50);
    this.p2Light.setIntensity(0.7);
    this.p2Light.setLightTo(false);

    this.raveLight = new Light();
    this.raveLight.setColor([...this.raveColor, 1]);
    this.raveLight.setXPos(50);
    this.raveLight.setYPos(50);
    this.raveLight.setZPos(10);
    this.raveLight.setNear(10);
    this.raveLight.setFar(53);
    this.raveLight.setIntensity(0.75);
    this.raveLight.setLightTo(true);
    setInterval(
      (() => {
        this.raveColor = this.raveColor.map(val => {
          var rand = Math.random() * 0.4;
          rand %= 0.75;
          rand += 0.25;
          return rand;
        });
        this.raveLight.setColor([...this.raveColor, 1]);
      }).bind(this),
      200
    );

    //add lights
    this.sceneRef.PlayerOneBaseSet.addLight(this.p1Light);
    this.sceneRef.PlayerOneBaseSet.addLight(this.raveLight);
    this.sceneRef.PlayerTwoBaseSet.addLight(this.p2Light);
    this.sceneRef.PlayerTwoBaseSet.addLight(this.raveLight);
    this.sceneRef.BG.addLight(this.p1Light);
    this.sceneRef.BG.addLight(this.p2Light);
    this.sceneRef.BG.addLight(this.raveLight);
    this.sceneRef.WaypointSet.addLight(this.p1Light);
    this.sceneRef.WaypointSet.addLight(this.p2Light);
    this.sceneRef.WaypointSet.addLight(this.raveLight);

    //events
    RoundManager.instance.OnWavingPlayerStart.subscribe(this._showSpawn.bind(this));
    RoundManager.instance.OnSpawnPointSelected.subscribe(this._showEnd.bind(this));
    RoundManager.instance.OnEndPointSelected.subscribe(this._dimSpawnEnd.bind(this));
    RoundManager.instance.OnWaveStart.subscribe(this._waveLights.bind(this));
    RoundManager.instance.OnWaveEnd.subscribe(this._endWaveLights.bind(this));
  }

  addLightsToDynamicObjects(obj) {
    obj.getRenderable().addLight(this.p1Light);
    obj.getRenderable().addLight(this.p2Light);
    obj.getRenderable().addLight(this.raveLight);
  }

  _showSpawn() {
    this.p1Light.setLightTo(false);
    this.p2Light.setLightTo(false);
    this.p1Light.setIntensity(0.7);
    this.p2Light.setIntensity(0.7);
    this.p1Light.setColor([0.5, 0.5, 1, 1]);
    this.p2Light.setColor([1, 0.5, 0.5, 1]);
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    if (p1Role === PlayerRole.Vaping) {
      this.p2Light.setLightTo(true);
    } else {
      this.p1Light.setLightTo(true);
    }
    this.raveLight.setIntensity(0.5);
  }

  _showEnd() {
    this.p1Light.setLightTo(false);
    this.p2Light.setLightTo(false);
    var p1Role = GameManager.instance.State.GameState.PlayerOne.Role;
    if (p1Role === PlayerRole.Vaping) {
      this.p1Light.setLightTo(true);
    } else {
      this.p2Light.setLightTo(true);
    }
  }

  _dimSpawnEnd() {
    this.p1Light.setLightTo(true);
    this.p2Light.setLightTo(true);
    this.p1Light.setColor([1, 1, 1, 1]);
    this.p2Light.setColor([1, 1, 1, 1]);
    this.p1Light.setIntensity(0.1);
    this.p2Light.setIntensity(0.1);
    this.raveLight.setIntensity(0.85);
  }

  _waveLights() {
    this.p1Light.setIntensity(0.45);
    this.p2Light.setIntensity(0.45);
    this.p1Light.setColor([0, 0, 1, 1]);
    this.p2Light.setColor([1, 0, 0, 1]);
    this.raveLight.setIntensity(0.05);
    this.sceneRef.BG.setColor([0, 0, 0, 0.7]);
    this.sceneRef.mCam.setBackgroundColor([5 / 255, 5 / 255, 7 / 255, 1]);
  }

  _endWaveLights() {
    this.sceneRef.BG.setColor([0, 0, 0, 0]);
    this.p1Light.setLightTo(false);
    this.p2Light.setLightTo(false);
    this.p1Light.setIntensity(0.7);
    this.p2Light.setIntensity(0.7);
    this.p1Light.setColor([0, 0, 1, 1]);
    this.p2Light.setColor([1, 0, 0, 1]);
    this.raveLight.setIntensity(0.85);
    this.sceneRef.mCam.setBackgroundColor([12 / 255, 13 / 255, 15 / 255, 1]);
  }
}
