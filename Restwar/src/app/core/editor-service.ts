import { Injectable } from '@angular/core';
import { Scene } from '@babylonjs/core';
import { Mechanism } from '../model/mechanisms/mechanism';
import { BasicRenderService } from '../services/BasicRenderService';
import { Construction } from './construction';
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

  private _construction: Construction;

  /**
   * the scene for the editor
   */
  private _scene: Scene;

  public get scene(): Scene {
    return this._scene;
  }

  constructor(private basicRenderService: BasicRenderService) {
    this.onSelectionMode = new Emitter<boolean>();
  }

  /**
   * is called when the render services has initialized
   * the scene
   */
  createEditorService() {
    this._scene = this.basicRenderService.scene;
    this._construction = new Construction();
  }

  /**
   * Adds a mechanism to the editor
   *
   * @param mechanism mechanism to be added
   */
  addMechanism(mechanism: Mechanism) {}
}
