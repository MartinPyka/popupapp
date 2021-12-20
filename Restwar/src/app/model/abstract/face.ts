import { ActionEvent, ExecuteCodeAction, Mesh, TransformNode } from '@babylonjs/core';
import { Object3D } from './object3d';
import { FaceClick, IModelDisposable } from '../interfaces/interfaces';
import { Subject, Subscription } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { TransformObject3D } from './transform.object3d';

/**
 * Abstract class for all objects, that represent a face mesh
 * for 3d and 2d.
 */
export abstract class Face extends TransformObject3D implements IModelDisposable {
  public readonly onPickDown: Subject<FaceClick>;

  // properties necessary for dispose-function
  public mesh: Mesh;
  readonly subscriptionList: Subscription[];
  protected triggerOnPickDown: ExecuteCodeAction;

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.subscriptionList = [];
    this.onPickDown = new Subject<FaceClick>();
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

  setParent(parent: TransformNode) {
    this.mesh.parent = parent;
  }
}
