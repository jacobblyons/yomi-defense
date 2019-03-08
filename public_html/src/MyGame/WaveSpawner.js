class WaveSpawner {
  constructor(sceneRef) {
    this.sceneRef = sceneRef;
    this.enabled = false;
    this.spawnTimer = 0;
    this.waveCount = 40;
    this.rm = RoundManager.instance;
    this.rm.OnWaveStart.subscribe(this._enable.bind(this));
    this.rm.OnWaveEnd.subscribe(this._disable.bind(this));
  }

  update() {
    if (!this.enabled) return;

    var waveSize =
      this.rm.State.InitialWaveSize +
      this.rm.State.InitialWaveSize * (this.rm.State.WaveSizeMultiplier * this.rm.State.CurrentWave);

    if (this.spawnTimer > 60 && this.rm.State.EnemiesSpawned < waveSize) {
      this.spawnTimer = 0;
      this.spawnEnemy();
      this.waveCount--;
    }
    this.spawnTimer++;
  }

  spawnEnemy() {
    this.rm.enemySpawned();
    this.sceneRef.instantiateEnemy();
  }

  _enable() {
    this.enabled = true;
  }
  _disable() {
    this.enabled = false;
  }
}
