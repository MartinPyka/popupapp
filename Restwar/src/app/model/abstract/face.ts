import { ActionEvent, ExecuteCodeAction, Mesh } from '@babylonjs/core';
import { Object3D } from './object3d';
import { IModelDisposable } from '../interfaces/interfaces';
import { Subject, Subscription } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';

/**
 * Abstract class for all objects, that represent a face mesh
 * for 3d and 2d.
 */
export abstract class Face extends Object3D implements IModelDisposable {
  public readonly onPickDown: Subject<ActionEvent>;

  // properties necessary for dispose-function
  public mesh: Mesh;
  readonly subscriptionList: Subscription[];
  protected triggerOnPickDown: ExecuteCodeAction;

  constructor() {
    super();
    this.subscriptionList = [];
    this.onPickDown = new Subject<ActionEvent>();
  }

  dispose() {
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
    if (this.mesh != undefined) {
      this.mesh.dispose();
    }

    if (this.triggerOnPickDown) {
      this.mesh.actionManager?.unregisterAction(this.triggerOnPickDown);
    }
  }
}
