import { Injectable } from '@angular/core';
import { Scene } from '@babylonjs/core';
import { Mechanism } from '../model/mechanisms/mechanism';
import { BasicRenderService } from '../services/BasicRenderService';
import { Emitter } from './emitter';

/** this is the main class for all communication that takes place between all
 * UI elements, the model and the UI-elements within the 3D-view. It manages basically
 * the entire coherent user experience by providing all 3d objects and all events
 * to the sub components.
 */
@Injectable({
  providedIn: 'root',
})
export class EditorService {
  /**
   * Emitter for activating and deactivating all kinds of selection modes.
   * Custom behaviors can be written that introduce new selection modes,
   * to which Object3D-behaviors can listen to.
   */
  readonly onSelectionMode: Emitter<boolean>;

  /**
   * list of all mechanisms used in the current editor
   */
  private readonly _listMechanisms: Mechanism[];

  /**
   * the scene for the editor
   */
  private readonly _scene: Scene;

  public get scene(): Scene {
    return this._scene;
  }

  constructor(basicRenderService: BasicRenderService) {
    this._scene = basicRenderService.scene;
    this.onSelectionMode = new Emitter<boolean>();
  }

  /**
   * Adds a mechanism to the editor
   *
   * @param mechanism mechanism to be added
   */
  addMechanism(mechanism: Mechanism) {
    this._listMechanisms.push(mechanism);
  }
}
