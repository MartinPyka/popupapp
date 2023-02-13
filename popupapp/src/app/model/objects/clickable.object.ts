import { Mesh } from 'babylonjs';
import { Face } from '../abstract/face';
import { TransformObject3D } from '../abstract/transform.object3d';

/**
 * Class for creating 3d-objects that are clickable
 */
export class ClickableObject extends Face {
  constructor(mesh: Mesh, parent: TransformObject3D | null) {
    super(parent);
    this.mesh = mesh;
    if (parent) {
      this.setParent(parent?.transform);
    }
    this.registerClickEvents();
  }
}
