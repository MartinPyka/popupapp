import { Material } from '@babylonjs/core';
import { Subject } from 'rxjs';
import { IClickable, PlaneClick, PlaneMove } from '../interfaces/interfaces';
import { Face } from './face';
import { TransformObject3D } from './transform.object3d';

/**
 * Abstract class for all objects, that represent a plane for 3d and 2d.
 * This could be part of the mechanism geometry or a plane that is used
 * as paper in the actual popup construction.
 */
export abstract class Plane extends TransformObject3D implements IClickable {
  public readonly onMouseDown: Subject<PlaneClick>;
  public readonly onMouseUp: Subject<PlaneClick>;
  public readonly onMouseMove: Subject<PlaneMove>;

  protected abstract topSide: Face;
  protected abstract downSide: Face;

  public set material(material: Material) {
    this.topSide.mesh.material = material;
    this.downSide.mesh.material = material;
  }

  constructor(parent: TransformObject3D | null) {
    super(parent);
    this.onMouseDown = new Subject<PlaneClick>();
    this.onMouseUp = new Subject<PlaneClick>();
    this.onMouseMove = new Subject<PlaneMove>();
  }

  override dispose(): void {
    super.dispose();

    this.onMouseDown.complete();
    this.onMouseUp.complete();
    this.onMouseMove.complete();

    this.topSide.dispose();
    this.downSide.dispose();
  }
}
