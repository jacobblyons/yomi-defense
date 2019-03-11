class Waypoint extends GameObject {
  constructor(pos, texture) {
    var rend = new LightRenderable(texture);
    //rend.setColor([1, 1, 1, 1]);
    super(rend);
    rend.setElementPixelPositions(0, 256, 1533, 1792);
    this.getXform().setSize(2, 2);
    this.gm = GameManager.instance;
    this.pos = pos;
    this.rotateDelta = 5;

    var rend2 = new Renderable();
    rend2.setColor([0, 1, 1, 1]);
    this.oppositeSpinning = new GameObject(rend2);
    this.oppositeSpinning.getXform().setXPos(pos.x);
    this.oppositeSpinning.getXform().setYPos(pos.y);
    this.oppositeSpinning.getXform().setSize(0.35, 0.35);

    this.getXform().setXPos(pos.x);
    this.getXform().setYPos(pos.y);
  }

  update() {
    this.getXform().incRotationByDegree(this.rotateDelta - 2);
    this.oppositeSpinning.getXform().incRotationByDegree(-this.rotateDelta);
  }

  draw(cam) {
    super.draw(cam);
    this.oppositeSpinning.draw(cam);
  }

  smallDraw = function(cam) {
    var pos = this.getXform().getPosition();
    for (var i = 0; i < this.gm.State.RoundState.Waypoints.length; i++) {
      var tpos = new vec2.fromValues(this.gm.State.RoundState.Waypoints[i].x, this.gm.State.RoundState.Waypoints[i].y);
      if (pos[0] - tpos[0] < 0.001 && pos[1] - tpos[1] < 0.001) {
        this.getRenderable().draw(cam);
      }
    }
  };
}
