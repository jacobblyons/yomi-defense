//enums
const Executing = Object.freeze({
  Game: "GAME",
  Menu: "MENU",
  GameOver: "GAME_OVER"
});

const Turn = Object.freeze({
  RoundMessage: "ROUND_MESSAGE",
  VapingReadyUp: "VAPING_READY_UP",
  Vaping: "VAPING",
  WavingReadyUp: "WAVING_READY_UP",
  Waving: "WAVING",
  RunningWave: "RUNNING_WAVE",
  FinishedWave: "FINISHED_WAVE"
});

const PlayerRole = Object.freeze({
  Waving: "WAVING",
  Vaping: "VAPING"
});

const BaseID = Object.freeze({
  Unselected: "UNSELECTED",
  P1: {
    One: "P1_1",
    Two: "P1_2",
    Three: "P1_3"
  },
  P2: {
    One: "P2_1",
    Two: "P2_2",
    Three: "P2_3"
  }
});

class State {
  constructor() {
    //inits
    this.AppState = {
      Executing: Executing.Menu,
      CanvasWidth: document.getElementById("GLCanvas").width,
      CanvasHeight: document.getElementById("GLCanvas").height,
      CameraWidth: 125,
      CameraCenter: {
        x: 50,
        y: 55
      },
      HUDTextSize: 2
    };

    this.GameState = {
      PlayerOne: {
        Role: PlayerRole.Waving,
        Score: 0,
        Bases: {
          [BaseID.P1.One]: { x: 10, y: 75 },
          [BaseID.P1.Two]: { x: 10, y: 50 },
          [BaseID.P1.Three]: { x: 10, y: 25 }
        }
      },
      PlayerTwo: {
        Role: PlayerRole.Vaping,
        Score: 0,
        Bases: {
          [BaseID.P2.One]: { x: 90, y: 75 },
          [BaseID.P2.Two]: { x: 90, y: 50 },
          [BaseID.P2.Three]: { x: 90, y: 25 }
        }
      },
      CurrentRound: 1,
      Rounds: -1,
      TowerFireRate: 1000
    };

    this.RoundState = {
      Turn: Turn.RoundMessage,
      SelectedSpawnBase: BaseID.Unselected,
      SelectedEndBase: BaseID.Unselected,
      WaypointLimit: 107,
      EnemiesSpawned: 0,
      EnemiesDestroyed: 0,
      InitialWaveSize: 10,
      WaveSizeMultiplier: 1,
      CurrentWave: 0,
      Waypoints: [],
      FakeWaypoints: [],
      Towers: []
    };
  }

  toString() {
    return `<b>AppState</b><br><pre>${JSON.stringify(this.AppState, null, 4)}</pre> 
    <br><br><b>RoundState</b><br><pre>${JSON.stringify(this.RoundState, null, 4)} </pre>
    <br><br><b>GameState</b><br><pre>${JSON.stringify(this.GameState, null, 4)}</pre> <br>`;
  }
}
