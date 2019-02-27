//enums
const Executing = Object.freeze({
  Game: "GAME",
  Menu: "MENU"
});

class State {
  constructor() {
    //inits
    this.AppState = {
      name: "jacob",
      Executing: Executing.Menu
    };

    this.GameState = {};

    this.RoundState = {};
  }

  toString() {
    return `<b>AppState</b><br>${JSON.stringify(this.AppState, null, 2)} 
    <br><br><b>GameState</b><br>${JSON.stringify(this.GameState, null, 2)} 
      <br><br><b>RoundState</b><br>${JSON.stringify(this.RoundState, null, 2)} <br> `;
  }
}
