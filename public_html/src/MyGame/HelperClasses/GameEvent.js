class GameEvent {
  constructor() {
    this.callbacks = [];
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }
  unsubscribe(callback) {
    this.callbacks.splice(this.callbacks.findIndex(c => c === callback), 1);
  }
  dispatch() {
    this.callbacks.forEach(c => c());
  }
}
