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
      SpawnPoints: [{ x: 10, y: 25 }, { x: 10, y: 50 }, { x: 10, y: 75 }],
      EndPoints: [{ x: 90, y: 25 }, { x: 90, y: 50 }, { x: 90, y: 75 }]
    };

    this.RoundState = {
      Turn: Turn.RoundMessage,
      Waypoints: [],
      Towers: [],
      SelectedSpawnPoint: Math.floor(Math.random() * 2.999),
      SelectedEndPoint: Math.floor(Math.random() * 2.999)
    };
  }

  toString() {
    return `<b>AppState</b><br><pre>${JSON.stringify(this.AppState, null, 4)}</pre> 
    <br><br><b>RoundState</b><br><pre>${JSON.stringify(this.RoundState, null, 4)} </pre>
    <br><br><b>GameState</b><br><pre>${JSON.stringify(this.GameState, null, 4)}</pre> <br>`;
  }
}
