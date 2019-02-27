class RoundManager {
  static instance;
  constructor() {
    if (RoundManager.instance) return RoundManager.instance;
    RoundManager.instance = this;
  }
}
