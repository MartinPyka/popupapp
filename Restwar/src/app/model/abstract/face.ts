import { ExecuteCodeAction, Mesh, TransformNode } from '@babylonjs/core';
import { FaceClick, FaceMove, IClickable, IModelDisposable } from '../interfaces/interfaces';
import { Subject } from 'rxjs';
import { TransformObject3D } from './transform.object3d';

/**
 * Abstract class for all objects, that represent a face mesh
 * for 3d and 2d.
 */
export abstract class Face extends TransformObject3D implements IModelDisposable, IClickable {
  public readonly onMouseDown: Subject<FaceClick>;
  public readonly onMouseUp: Subject<FaceClick>;
  public readonly onMouseMove: Subject<FaceMove>;

  // properties necessary for dispose-function
  public mesh: Mesh;
  protected executeActionList: ExecuteCodeAction[];

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.onMouseDown = new Subject<FaceClick>();
    this.onMouseUp = new Subject<FaceClick>();
    this.onMouseMove = new Subject<FaceMove>();
    this.executeActionList = [];
  }

  override dispose() {
    super.dispose();
    this.executeActionList.forEach((executeAction) => {
      if (executeAction) {
        this.mesh.actionManager?.unregisterAction(executeAction);
      }
    });

    if (this.mesh != undefined) {
      this.mesh.dispose();
    }

    this.onMouseDown.complete();
    this.onMouseUp.complete();
    this.onMouseMove.complete();
  }

  setParent(parent: TransformNode) {
    this.mesh.parent = parent;
  }
}
