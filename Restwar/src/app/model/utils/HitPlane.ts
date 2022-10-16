import {
  DeepImmutableObject,
  Mesh,
  MeshBuilder,
  Nullable,
  PickingInfo,
  Ray,
  TransformNode,
  Vector2,
  Vector3,
} from 'babylonjs';

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
    this.mesh.isVisible = false;
  }

  dispose() {
    this.mesh.dispose();
  }

  /**
   * Computes the hit location for a given ray and
   * returns the coordinates
   * @param ray to be used in order to detect the hit location
   * @returns 2d-coordinates in case of a hit
   */
  getHitLocation(ray: Nullable<Ray>): Nullable<Vector2> {
    if (ray) {
      const pickingInfo = ray.intersectsMesh(<DeepImmutableObject<Mesh>>(<unknown>this.mesh));

      if (pickingInfo.pickedPoint) return new Vector2(pickingInfo.pickedPoint.y, pickingInfo.pickedPoint.z);
      else {
        return null;
      }
    }
    return null;
  }
}
