import UnifiedMapEngine from './UnifiedMapEngine';

export class MapEngineFactory {
  private static instance: IMapEngine;

  static getEngine(): IMapEngine {
    if (!this.instance) {
      this.instance = new UnifiedMapEngine();
    }
    return this.instance;
  }

  static destroyEngine() {
    this.instance?.destroy();
    this.instance = null;
  }
}