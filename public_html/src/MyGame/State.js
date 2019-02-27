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
}
