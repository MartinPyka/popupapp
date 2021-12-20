import { ActionEvent, TransformNode } from '@babylonjs/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IModelDisposable, PlaneClick } from '../interfaces/interfaces';
import { Face } from './face';
import { TransformObject3D } from './transform.object3d';

/**
 * Abstract class for all objects, that represent a plane for 3d and 2d.
 * This could be part of the mechanism geometry or a plane that is used
 * as paper in the actual popup construction.
 */
export abstract class Plane extends TransformObject3D implements IModelDisposable {
  public readonly onPickDown: Subject<PlaneClick>;
  public readonly subscriptionList: Subscription[];

  protected abstract topSide: Face;
  protected abstract downSide: Face;

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.subscriptionList = [];
    this.onPickDown = new Subject<PlaneClick>();
  }

  dispose(): void {
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
  }
}
