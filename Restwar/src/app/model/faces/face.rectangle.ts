import {
  ActionManager,
  ExecuteCodeAction,
  MeshBuilder,
  Scene,
  TransformNode,
  Vector3,
  VertexBuffer,
} from '@babylonjs/core';
import { sceneUboDeclaration } from '@babylonjs/core/Shaders/ShadersInclude/sceneUboDeclaration';
import { BehaviorSubject } from 'rxjs';
import { Face } from '../abstract/face';
import { TransformObject3D } from '../abstract/transform.object3d';

/**
 * This face class is typically used in mechanism to depict the faces
 * of a plane. It does not contain any transformation matrix as
 * configurable property as it is usually parented to its plane object
 */
export class FaceRectangle extends Face {
  // Model parameters
  public readonly height: BehaviorSubject<number>;
  public readonly width: BehaviorSubject<number>;
  public readonly flipped: BehaviorSubject<boolean>;

  // Events

  /**
   * Creates a new plane mesh
   * @param width Width of the plane, affects the vertex positions
   * @param height Height of the plane, affects the vertex positions
   * @param flipped if true, plane is flipped by 180° along the x axis
   * @param scene the scene, to which the face will be added
   * @param parent null or a parent mesh, whose transform will be used as parent
   */
  constructor(width: number = 1, height: number = 1, flipped: boolean, scene: Scene, parent: TransformObject3D | null) {
    super(parent);

    this.width = new BehaviorSubject<number>(width);
    this.height = new BehaviorSubject<number>(height);
    this.flipped = new BehaviorSubject<boolean>(flipped);

    this.createGeometry(scene);
    this.registerEvents();
  }

  protected createGeometry(scene: Scene) {
    this.mesh = MeshBuilder.CreatePlane(
      this.id,
      { width: this.width.value, height: this.height.value, updatable: true },
      scene
    );

    this.realignMesh();

    // this mesh gets a parent, if parent is not null
    if (this.parent != null) {
      this.mesh.parent = this.parent.transform;
    }
  }

  /**
   * realigns the geometry so that the maths is easier to handle. Plane is
   * positioned at 0,0 for the bottom left corner
   */
  protected realignMesh() {
    // realign the vertices
    var positions = this.mesh.getVerticesData(VertexBuffer.PositionKind);
    if (positions == null) {
      return;
    }

    // when looking at the plane with y-Axis as up and x-Axis as right
    // bottom left
    positions[0] = -this.width.value / 2;
    positions[1] = 0;
    positions[2] = 0;

    // bottom right
    positions[3] = this.width.value / 2;
    positions[4] = 0;
    positions[5] = 0;

    // top right
    positions[6] = this.width.value / 2;
    positions[7] = this.height.value;
    positions[8] = 0;

    // top left
    positions[9] = -this.width.value / 2;
    positions[10] = this.height.value;
    positions[11] = 0;

    this.mesh.updateVerticesData(VertexBuffer.PositionKind, positions);
  }

  protected registerEvents() {
    // subscription to flipped value
    this.subscriptionList.push(
      this.flipped.subscribe((value) => {
        if (value) {
          this.mesh.rotation = new Vector3(0, Math.PI, 0);
        } else {
          this.mesh.rotation = new Vector3(0, 0, 0);
        }
      })
    );

    this.subscriptionList.push(
      this.width.subscribe((width) => {
        // update the width on the mesh
        var positions = this.mesh.getVerticesData(VertexBuffer.PositionKind);
        if (positions == null) {
          return;
        }
        // bottom left
        positions[0] = -width / 2;
        // top left
        positions[9] = -width / 2;

        // bottom right
        positions[3] = width / 2;
        // top right
        positions[6] = width / 2;

        this.mesh.updateVerticesData(VertexBuffer.PositionKind, positions);
        this.mesh.refreshBoundingInfo();
      })
    );

    this.subscriptionList.push(
      this.height.subscribe((height) => {
        // update the width on the mesh
        var positions = this.mesh.getVerticesData(VertexBuffer.PositionKind);
        if (positions == null) {
          return;
        }

        // top right
        positions[7] = height;
        // top left
        positions[10] = height;

        this.mesh.updateVerticesData(VertexBuffer.PositionKind, positions);
        this.mesh.refreshBoundingInfo();
      })
    );

    this.mesh.actionManager = new ActionManager(this.mesh.getScene());

    this.triggerOnPickDown = new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (evt) => {
      const pickInfo = this.mesh.getScene().pick(evt.pointerX, evt.pointerY);
      if (!pickInfo) return;
      const rayDirection = pickInfo.ray?.direction;
      const normalDirection = pickInfo.getNormal(true);
      if (rayDirection != null && normalDirection != null) {
        if (Vector3.Dot(rayDirection, normalDirection) > 0) {
          return;
        }
      }
      this.onPickDown.next({ face: this, event: evt });
    });
    this.mesh.actionManager.registerAction(this.triggerOnPickDown);
  }
}
