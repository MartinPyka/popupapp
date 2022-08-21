import { Mesh, MeshBuilder, Nullable, TransformNode, Vector3 } from 'babylonjs';

const HITPLANE_WIDTH = 1000;
const HITPLANE_HEIGHT = 1000;

/**
 * Class that creates an invisible hit plane that can be used to
 * track mouse movements in 3d on a plane that depends on a UI
 * object
 */
export class HitPlane {
  protected mesh: Mesh;

  constructor(parent: TransformNode) {
    this.mesh = MeshBuilder.CreatePlane('HitPlane', { width: HITPLANE_WIDTH, height: HITPLANE_HEIGHT }, undefined);
    this.mesh.parent = parent;
    /* the hit plane should be orthogonal to the hinge and at the
    edge of the plane */
    //this.mesh.isVisible = false;
  }

  dispose() {
    this.mesh.dispose();
  }
}
