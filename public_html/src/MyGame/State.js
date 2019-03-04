//enums
const Executing = Object.freeze({
  Game: "GAME",
  Menu: "MENU"
});

const Turn = Object.freeze({
  RoundMessage: "ROUND_MESSAGE",
  VapingReadyUp: "VAPING_READY_UP",
  Vaping: "VAPING",
  WavingReadyUp: "WAVING_READY_UP",
  Waving: "WAVING",
  RunningWave: "RUNNING_WAVE"
});

class State {
  constructor() {
    //inits
    this.AppState = {
      Executing: Executing.Menu,
      CanvasWidth: document.getElementById("GLCanvas").width,
      CanvasHeight: document.getElementById("GLCanvas").height,
      CameraWidth: 100,
      CameraCenter: {
        x: 50,
        y: 50
      },
      HUDTextSize: 2
    };

    this.GameState = {
      P1Points: 0,
      P2Points: 0,
      SpawnPoints: [{ x: 0, y: 50 }, { x: 0, y: 100 }, { x: 0, y: 150 }],
      EndPoint: [{ x: 600, y: 50 }, { x: 600, y: 100 }, { x: 600, y: 150 }]
    };

    this.RoundState = {
      Turn: Turn.RoundMessage,
      Waypoints: [],
      Towers: []
    };
  }

  toString() {
    return `<b>AppState</b><br><pre>${JSON.stringify(this.AppState, null, 4)}</pre> 
    <br><br><b>RoundState</b><br><pre>${JSON.stringify(this.RoundState, null, 4)} </pre>
    <br><br><b>GameState</b><br><pre>${JSON.stringify(this.GameState, null, 4)}</pre> <br>`;
  }
}
