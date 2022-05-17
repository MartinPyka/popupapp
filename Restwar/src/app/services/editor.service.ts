import { Injectable, Type } from '@angular/core';
import { Scene } from '@babylonjs/core';
import { Subject, Subscription } from 'rxjs';
import { Behavior } from '../behaviors/behavior';
import { IBehaviorCollection, IModelDisposable } from '../model/interfaces/interfaces';
import { Mechanism } from '../model/mechanisms/mechanism';
import { BasicRenderService } from './BasicRenderService';
import { Construction } from '../model/mechanisms/construction';
import { SwitchPanel } from '../core/switchpanel';

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
   * Emitter for activating and deactivating all kinds of work modes.
   * Custom behaviors can be written that introduce new work modes,
   * to which Object3D-behaviors can listen to.
   */
  readonly onWorkMode: SwitchPanel;

  /**
   * Emitter for various selection modes that make parts of the construction
   * visible / selectable
   */
  private readonly _onSelectionMode: SwitchPanel;

  // an event that fires, when the EditorService is diposed
  readonly onDispose: Subject<void>;

  private _construction: Construction;

  private _behaviorList: Behavior<EditorService>[];

  /**
   * stores the string of the current Work mode in order to
   * deactivate it, when the next one is activated
   */
  private _currentWorkMode: string;

  public get behaviorList(): Behavior<EditorService>[] {
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
    this.onWorkMode = new SwitchPanel();
    this._onSelectionMode = new SwitchPanel();
    this._currentWorkMode = '';
    this.onDispose = new Subject<void>();
  }

  dispose(): void {
    this._construction.dispose();
    this._behaviorList.forEach((behavior) => behavior.dispose());

    this.onWorkMode.complete();
    this._onSelectionMode.complete();

    this.onDispose.next();
    this.onDispose.complete();
  }

  /**
   * activates the given Work mode
   * @param mode mode to be activated
   */
  setWorkMode(mode: string): void {
    // if the mode does not exist, abort
    if (!this.onWorkMode.exist(mode)) {
      return;
    }

    // _currentWorkMode could be '', therefore this check
    if (this.onWorkMode.exist(this._currentWorkMode)) {
      // deactivate the old one
      this.onWorkMode.emit(this._currentWorkMode);
    }

    // activate the new one
    this._currentWorkMode = mode;
    this.onWorkMode.emit(this._currentWorkMode);
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
  public addBehavior(type: Type<Behavior<EditorService>>): Behavior<EditorService> {
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
  public getBehavior(type: Type<Behavior<EditorService>>): Behavior<EditorService> | null {
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
  public removeBehavior(type: Type<Behavior<EditorService>>): void {
    const behavior = this.getBehavior(type);
    if (behavior) {
      behavior.dispose();
    }
    this._behaviorList = this.behaviorList.filter((behavior) => behavior.constructor.name != type.name);
  }

  /**
   * registers an event for a given selection mode
   * @param name Name of the selection mode
   * @param handler handler function
   * @returns subscription
   */
  public registerSelection(name: string, handler: (value: boolean) => void): Subscription {
    return this._onSelectionMode.on(name, handler);
  }

  public triggerSelection(name: string) {
    this._onSelectionMode.emit(name);
  }
}
