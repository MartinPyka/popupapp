import { Emitter } from './emitter';

/**
 * This is a special case of the emitter for activating
 * and deactivating a multitude of modes. When one
 * mode gets activated, all other get deactivated
 */
export class SwitchPanel extends Emitter<boolean> {
  private _currentSwitch = '';

  /**
   * Triggers a true-event for the given channel
   * @param name Name of the channel
   */
  public override emit(name: string) {
    if (this._currentSwitch != '') {
      super.emit(this._currentSwitch, false);
    }
    super.emit(name, true);
    this._currentSwitch = name;
  }
}
