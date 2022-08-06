import { Injectable, Type } from '@angular/core';
import { Scene } from 'babylonjs';
import { Observable, Subject, Subscription } from 'rxjs';
import { Behavior } from '../behaviors/behavior';
import {
  IBehaviorCollection,
  IModelDisposable,
  MechanismFaceClick,
  MechanismHingeClick,
} from '../model/interfaces/interfaces';
import { Mechanism } from '../model/mechanisms/mechanism';
import { BasicRenderService } from './BasicRenderService';
import { Construction } from '../model/mechanisms/construction';
import { SwitchPanel } from '../core/switchpanel';
import { Object3D } from '../model/abstract/object3d';

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
  private readonly _onWorkMode: SwitchPanel;

  /**
   * Emitter for various selection modes that make parts of the construction
   * visible / selectable
   */
  private readonly _onSelectionMode: SwitchPanel;

  /**
   * Emitter for transform objects that are in selected state
   */
  private readonly _selectedObject3D: Subject<Object3D>;

  public get selectedObject3D(): Observable<Object3D> {
    return this._selectedObject3D.asObservable();
  }

  // an event that fires, when the EditorService is diposed
  readonly onDispose: Subject<void>;

  private _construction: Construction;

  private _behaviorList: Behavior<EditorService>[];

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
    this._onWorkMode = new SwitchPanel();
    this._onSelectionMode = new SwitchPanel();
    this._selectedObject3D = new Subject<Object3D>();
    this.onDispose = new Subject<void>();
    this._behaviorList = [];
  }

  dispose(): void {
    this._construction.dispose();
    this._behaviorList.forEach((behavior) => behavior.dispose());

    this._onWorkMode.complete();
    this._onSelectionMode.complete();

    this.onDispose.next();
    this.onDispose.complete();
  }

  /**
   * activates the given Work mode
   * @param mode mode to be activated
   */
  setWorkMode(mode: string): void {
    // activate the new one
    this._onWorkMode.emit(mode);
  }

  /**
   * registers a new working mode
   * @param mode
   * @param handler
   */
  registerWorkMode(mode: string, handler: (value: boolean) => void) {
    this._onWorkMode.on(mode, handler);
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
  addMechanism(mechanism: Mechanism) {
    this._construction.add(mechanism);
  }

  removeMechanism(mechanism: Mechanism) {
    this._construction.remove(mechanism);
  }

  public setSelectedObject3D(object: Object3D) {
    this._selectedObject3D.next(object);
  }

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

  /**
   * sends out a signal for a selection mode. All 3d objects listen to this. If there
   * key word is used, they react. Keywords are stored in Channel.ts. With the key word technique
   * the selection modes can be easily extended
   * @param name
   */
  public triggerSelection(name: string) {
    this._onSelectionMode.emit(name);
  }

  public onFaceDown(): Observable<MechanismFaceClick> {
    return this._construction.onFaceDown;
  }

  public onHingeDown(): Observable<MechanismHingeClick> {
    return this._construction.onHingeDown;
  }
}
