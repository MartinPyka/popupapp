import { TransformNode, Vector3 } from '@babylonjs/core';
import { Plane } from '../abstract/plane';
import { TransformObject3D } from '../abstract/transform.object3d';

/**
 * basic hinge class for all kinds of mechanisms that use
 * hinges
 */
export abstract class Hinge extends TransformObject3D {
  /**
   * Left side of the hinge. Every object is attached to this
   * transform
   */
  readonly leftTransform: TransformNode;

  /**
   * Right side of the hinge. Every object is attached to this
   * transform
   */
  readonly rightTransform: TransformNode;

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.leftTransform = new TransformNode('transform');
    this.rightTransform = new TransformNode('transform');

    // transforms are parented to the main transform
    this.leftTransform.parent = this.transform;
    this.rightTransform.parent = this.transform;

    // the right side is flipped by 180° on the y-axis,
    // so that the z-axis of the faces are within the 0-180
    // degree fold
    this.rightTransform.rotate(new Vector3(0, 1, 0), Math.PI);
  }
}
