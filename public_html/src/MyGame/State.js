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
  Waving: "WAVING"
});

class State {
  constructor() {
    //inits
    this.AppState = {
      Executing: Executing.Menu
    };

    this.GameState = {
      P1Points: 0,
      P2Points: 0
    };

    this.RoundState = {
      Turn: Turn.RoundMessage
    };
  }

  toString() {
    return `<b>AppState</b><br>${JSON.stringify(this.AppState, null, 2)} 
    <br><br><b>GameState</b><br>${JSON.stringify(this.GameState, null, 2)} 
      <br><br><b>RoundState</b><br>${JSON.stringify(this.RoundState, null, 2)} <br> `;
  }
}
