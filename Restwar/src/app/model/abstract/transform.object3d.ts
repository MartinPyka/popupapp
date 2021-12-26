import { TransformNode } from '@babylonjs/core';
import { Object3D } from './object3d';

/**
 * Abstract class for all application-related 3d objects that have
 * a transform
 */
export abstract class TransformObject3D extends Object3D {
  // geometry properties

  // parent can be changed via getter and setter
  private _parent: TransformObject3D | null;

  public get parent(): TransformObject3D | null {
    return this._parent;
  }

  /**
   * if parent is set, then the transform of the parent is the
   * parent of the transform of this object
   */
  public set parent(parent: TransformObject3D | null) {
    this._parent = parent;
    if (this.parent) {
      this._transform.parent = this.parent.transform;
    } else {
      this._transform.parent = null;
    }
  }

  // internal property
  private _transform: TransformNode;

  /**
   * transform of the object
   */
  public get transform(): TransformNode {
    return this._transform;
  }

  constructor(parent: TransformObject3D | null) {
    super();
    this._transform = new TransformNode('transform');
    this.parent = parent;
  }
}
