import { Material } from '@babylonjs/core';
import { Subject } from 'rxjs';
import { PlaneClick } from '../interfaces/interfaces';
import { Face } from './face';
import { TransformObject3D } from './transform.object3d';

/**
 * Abstract class for all objects, that represent a plane for 3d and 2d.
 * This could be part of the mechanism geometry or a plane that is used
 * as paper in the actual popup construction.
 */
export abstract class Plane extends TransformObject3D {
  public readonly onPickDown: Subject<PlaneClick>;

  protected abstract topSide: Face;
  protected abstract downSide: Face;

  public set material(material: Material) {
    this.topSide.mesh.material = material;
    this.downSide.mesh.material = material;
  }

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.onPickDown = new Subject<PlaneClick>();
  }

  override dispose(): void {
    super.dispose();
    this.onPickDown.complete();
    this.topSide.dispose();
    this.downSide.dispose();
  }
}
