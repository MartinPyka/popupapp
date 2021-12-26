import { Vector3 } from '@babylonjs/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Plane } from '../abstract/plane';
import { TransformObject3D } from '../abstract/transform.object3d';
import { IModelDisposable } from '../interfaces/interfaces';
import { Hinge } from './hinge';

/**
 * An active hinge can be modified by the user. The user can control
 * the angle of the hinge and thereby control the folding movement of
 * the entire popup or of sub parts of the popup. The left and the
 * right angle can be controlled independently. That means, that if
 * both angles have the same number, the fold is closed. The inner
 * angle is rightAngle-leftAngle, which should always result in a
 * positive number. At 0 degrees, the plane is oriented in the
 * y-direction of the global space. (if not parented to another
 * transform)
 */
export abstract class HingeActive extends Hinge implements IModelDisposable {
  readonly subscriptionList: Subscription[];

  /**
   * 3d representation of the left side of the hinge
   */
  abstract readonly leftPlane: Plane;

  /**
   * 3d representation of the right side of the hinge
   */
  abstract readonly rightPlane: Plane;

  // Model parameters

  /** the left angle to which the hinge is opened */
  public readonly leftAngle: BehaviorSubject<number>;

  /** the right angle to which the hinge is opened */
  public readonly rightAngle: BehaviorSubject<number>;

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.subscriptionList.push(
      this.leftAngle.subscribe((angle) => {
        this.leftTransform.rotation.x = angle;
      })
    );

    this.subscriptionList.push(
      this.rightAngle.subscribe((angle) => {
        this.rightTransform.rotation.x = angle;
      })
    );
  }

  dispose() {
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
  }
}
