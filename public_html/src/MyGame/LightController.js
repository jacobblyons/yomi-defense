class LightController {
  constructor(sceneRef) {
    this.sceneRef = sceneRef;
    /** @type {LightSet} */
    this.LightSet = new LightSet();

    var p1Light = new Light();
    p1Light.setColor([1, 1, 1, 1]);
    p1Light.setXPos(50);
    p1Light.setYPos(50);
    p1Light.setZPos(5);
    p1Light.setNear(20);
    p1Light.setFar(50);
    p1Light.setIntensity(5.5);
    p1Light.setLightTo(true);
    this.LightSet.addToSet(p1Light);
  }
  update() {}
  draw() {}
}
