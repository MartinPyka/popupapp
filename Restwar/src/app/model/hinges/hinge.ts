import { Plane } from '../abstract/plane';
import { TransformObject3D } from '../abstract/transform.object3d';

/**
 * basic hinge class for all kinds of mechanisms that use
 * hinges
 */
export class Hinge extends TransformObject3D {
  //

  // geometry properties
  readonly leftHingeSide: Plane;
  readonly rightHingeSide: Plane;

  constructor(leftHingeSide: Plane, rightHingeSide: Plane, parent: TransformObject3D | null) {
    super(parent);
    this.leftHingeSide = leftHingeSide;
    this.rightHingeSide = rightHingeSide;
  }
}
