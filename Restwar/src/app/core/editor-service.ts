import { Injectable, Type } from '@angular/core';
import { Scene } from '@babylonjs/core';
import { Subject } from 'rxjs';
import { Behavior } from '../behaviors/behavior';
import { IBehaviorCollection, IModelDisposable } from '../model/interfaces/interfaces';
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
export class EditorService implements IBehaviorCollection, IModelDisposable {
  /**
   * Emitter for activating and deactivating all kinds of selection modes.
   * Custom behaviors can be written that introduce new selection modes,
   * to which Object3D-behaviors can listen to.
   */
  readonly onSelectionMode: Emitter<boolean>;

  // an event that fires, when the Object3D is diposed
  readonly onDispose: Subject<void>;

  private _construction: Construction;

  private _behaviorList: Behavior[];

  /**
   * stores the string of the current selection mode in order to
   * deactivate it, when the next one is activated
   */
  private _currentSelectionMode: string;

  public get behaviorList(): Behavior[] {
    return this._behaviorList;
  }

  /**
   * the scene for the editor
   */
  private _scene: Scene;

  public get scene(): Scene {
    return this._scene;
  }

  constructor(private basicRenderService: BasicRenderService) {
    this.onSelectionMode = new Emitter<boolean>();
    this._currentSelectionMode = '';
    this.onDispose = new Subject<void>();
  }

  dispose(): void {
    this._construction.dispose();
    this._behaviorList.forEach((behavior) => behavior.dispose());

    this.onSelectionMode.complete();
    this.onDispose.next();
    this.onDispose.complete();
  }

  /**
   * activates the given selection mode
   * @param mode mode to be activated
   */
  setSelectionMode(mode: string): void {
    // if the mode does not exist, abort
    if (!this.onSelectionMode.exist(mode)) {
      return;
    }

    // _currentSelectionMode could be '', therefore this check
    if (this.onSelectionMode.exist(this._currentSelectionMode)) {
      // deactivate the old one
      this.onSelectionMode.emit(this._currentSelectionMode, false);
    }

    // activate the new one
    this._currentSelectionMode = mode;
    this.onSelectionMode.emit(this._currentSelectionMode, true);
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

  /**
   * @inheritdoc
   */
  public addBehavior(type: Type<Behavior>): Behavior {
    const result = this.getBehavior(type);
    if (result) {
      return result;
    }

    const behavior = new type(this);
    this.behaviorList.push(behavior);
    return behavior;
  }

  /**
   * @inheritdoc
   */
  public getBehavior(type: Type<Behavior>): Behavior | null {
    const result = this.behaviorList.filter((behavior) => behavior.constructor.name === type.name);
    if (result.length === 0) {
      return null;
    } else {
      return result[0];
    }
  }

  /**
   * @inheritdoc
   */
  public removeBehavior(type: Type<Behavior>): void {
    const behavior = this.getBehavior(type);
    if (behavior) {
      behavior.dispose();
    }
    this._behaviorList = this.behaviorList.filter((behavior) => behavior.constructor.name != type.name);
  }
}
