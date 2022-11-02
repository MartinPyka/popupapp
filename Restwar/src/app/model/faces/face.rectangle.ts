import { FloatArray, MeshBuilder, Scene, Vector3, VertexBuffer } from 'babylonjs';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { Face } from '../abstract/face';
import { TransformObject3D } from '../abstract/transform.object3d';
import { IProjectionPoints } from '../interfaces/interfaces';
import { Point } from 'paper/dist/paper-core';

/**
 * This face class is typically used in mechanism to depict the faces
 * of a plane. It does not contain any transformation matrix as
 * configurable property as it is usually parented to its plane object
 */
export class FaceRectangle extends Face implements IProjectionPoints {
  // Model parameters
  public readonly height: BehaviorSubject<number>;
  public readonly width: BehaviorSubject<number>;
  public readonly flipped: BehaviorSubject<boolean>;

  // Points of the ThreeJS plane. They are also used for the 2d projection
  private positions: FloatArray;
  private projection: BehaviorSubject<paper.Point[]>;

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
    this.createProjection();
    this.registerPropertyEvents();
    this.registerClickEvents();
  }

  override dispose(): void {
    super.dispose();
    this.width.complete();
    this.height.complete();
    this.flipped.complete();
    this.projection.complete();
  }

  /**
   * a face rectangle does not contain any glue hints, therefore
   * an empty behavior subject is returned
   * @returns empty behavior subject list of paper.Point
   */
  public projectionGlueHints(): BehaviorSubject<paper.Point[]> {
    return new BehaviorSubject<paper.Point[]>([]);
  }

  /**
   * Returns the topside projection of this mesh
   *
   * @returns the path of this mesh
   */
  public projectionPointsTopSide(): BehaviorSubject<paper.Point[]> {
    return this.projection;
  }

  /**
   * Returns the downside projection of this mesh
   *
   * @returns the path of this mesh
   */
  public projectionPointsDownSide(): BehaviorSubject<paper.Point[]> {
    return this.projection;
  }

  /**
   * Returns the topside projection points as value
   *
   * @returns point list of projection
   */
  public projectionPointsTopSideValue(): paper.Point[] {
    return this.projection.getValue();
  }

  /**
   * Returns the downside projection points as value
   *
   * @returns point list of projection
   */
  public projectionPointsDownSideValue(): paper.Point[] {
    return this.projection.getValue();
  }

  protected createGeometry(scene: Scene) {
    this.mesh = MeshBuilder.CreatePlane(
      this.id,
      { width: this.width.value, height: this.height.value, updatable: true },
      scene
    );

    // store the positions in a separate array so that we can quickly access them
    const positions = this.mesh.getVerticesData(VertexBuffer.PositionKind);
    if (positions == null) {
      return;
    }
    this.positions = positions;

    this.realignMesh();
    this.setParent(this.transform);
  }

  /**
   * projection of the rectangle into 2d
   */
  protected createProjection() {
    let points = [];

    points.push(
      new Point(this.positions[0], this.positions[1]),
      new Point(this.positions[9], this.positions[10]),
      new Point(this.positions[6], this.positions[7]),
      new Point(this.positions[3], this.positions[4])
    );
    this.projection = new BehaviorSubject<paper.Point[]>(points);
  }

  /**
   * realigns the geometry so that the maths is easier to handle. Plane is
   * positioned at 0,0 for the bottom left corner
   */
  protected realignMesh() {
    // when looking at the plane with y-Axis as up and x-Axis as right
    // bottom left
    this.positions[0] = -this.width.value / 2;
    this.positions[1] = 0;
    this.positions[2] = 0;

    // bottom right
    this.positions[3] = this.width.value / 2;
    this.positions[4] = 0;
    this.positions[5] = 0;

    // top right
    this.positions[6] = this.width.value / 2;
    this.positions[7] = this.height.value;
    this.positions[8] = 0;

    // top left
    this.positions[9] = -this.width.value / 2;
    this.positions[10] = this.height.value;
    this.positions[11] = 0;

    this.mesh.updateVerticesData(VertexBuffer.PositionKind, this.positions);
  }

  protected registerPropertyEvents() {
    // subscription to flipped value
    this.flipped.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      if (value) {
        this.mesh.rotation = new Vector3(0, Math.PI, 0);
      } else {
        this.mesh.rotation = new Vector3(0, 0, 0);
      }
    });

    this.width.pipe(takeUntil(this.onDispose)).subscribe((width) => {
      // update the width on the mesh
      // bottom left
      this.updateMeshWidth(width);
      this.updateProjectionWidth(width);
    });

    this.height.pipe(takeUntil(this.onDispose)).subscribe((height) => {
      // update the height on the mesh
      // top right
      this.updateMeshHeight(height);
      this.updateProjectionHeight(height);
    });
  }

  private updateMeshHeight(height: number) {
    this.positions[7] = height;
    // top left
    this.positions[10] = height;

    this.mesh.updateVerticesData(VertexBuffer.PositionKind, this.positions);
    this.mesh.refreshBoundingInfo();
  }

  private updateMeshWidth(width: number) {
    const offsetWidth = width / 2;
    this.positions[0] = -offsetWidth;
    // top left
    this.positions[9] = -offsetWidth;

    // bottom right
    this.positions[3] = offsetWidth;
    // top right
    this.positions[6] = offsetWidth;

    this.mesh.updateVerticesData(VertexBuffer.PositionKind, this.positions);
    this.mesh.refreshBoundingInfo();
  }

  private updateProjectionWidth(width: number) {
    let points = this.projection.getValue();
    const offsetWidth = width / 2;
    points[0].x = -offsetWidth;
    points[1].x = -offsetWidth;
    points[2].x = offsetWidth;
    points[3].x = offsetWidth;
    this.projection.next(points);
  }

  private updateProjectionHeight(height: number) {
    let points = this.projection.getValue();
    points[1].y = height;
    points[2].y = height;
    this.projection.next(points);
  }
}
