import { Scene } from 'babylonjs';
import { deg2rad, rad2deg } from 'src/app/utils/math';
import { TransformObject3D } from '../abstract/transform.object3d';
import { Mechanism } from '../mechanisms/mechanism';
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
export class HingeActive extends Hinge {
  // Model parameters

  /** the left angle to which the hinge is opened */
  private _leftAngle: number;

  public get leftAngle(): number {
    return rad2deg(this._leftAngle);
  }

  public set leftAngle(value: number) {
    this._leftAngle = deg2rad(value);
    this.leftTransform.transform.rotation.x = this._leftAngle;
    this.onChange.next();
  }

  /** the right angle to which the hinge is opened */
  private _rightAngle: number;

  public get rightAngle(): number {
    return rad2deg(this._rightAngle);
  }

  public set rightAngle(value: number) {
    this._rightAngle = deg2rad(value);
    this.rightTransform.transform.rotation.x = this._rightAngle;
    this.onChange.next();
  }

  constructor(parent: TransformObject3D | null, parentMechanism: Mechanism | null, scene: Scene) {
    super(parent, parentMechanism, scene);
    this.leftAngle = 0;
    this.rightAngle = 0;
  }
}
