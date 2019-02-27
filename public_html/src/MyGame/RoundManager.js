class RoundManager {
  static instance;
  constructor() {
    if (this.instance) return this.instance;
    this.instance = this;
  }
}
