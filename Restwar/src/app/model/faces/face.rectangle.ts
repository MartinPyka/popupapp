import {
  ActionEvent,
  ActionManager,
  ExecuteCodeAction,
  FloatArray,
  MeshBuilder,
  Observer,
  PointerEventTypes,
  PointerInfo,
  Scene,
  Vector3,
  VertexBuffer,
} from '@babylonjs/core';
import { Nullable } from '@babylonjs/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { Face } from '../abstract/face';
import { TransformObject3D } from '../abstract/transform.object3d';
import { IProjectable } from '../interfaces/interfaces';
import { Path } from 'paper';
import { COLOR_STROKE } from 'src/app/materials/material-service';
import { Point } from 'paper/dist/paper-core';

/**
 * This face class is typically used in mechanism to depict the faces
 * of a plane. It does not contain any transformation matrix as
 * configurable property as it is usually parented to its plane object
 */
export class FaceRectangle extends Face implements IProjectable {
  // Model parameters
  public readonly height: BehaviorSubject<number>;
  public readonly width: BehaviorSubject<number>;
  public readonly flipped: BehaviorSubject<boolean>;

  // Points of the ThreeJS plane. They are also used for the 2d projection
  private positions: FloatArray;
  private projection: paper.Path;

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
    this.registerEvents();
  }

  override dispose(): void {
    super.dispose();
    this.width.complete();
    this.height.complete();
    this.flipped.complete();
    this.projection.remove();
  }

  /**
   * Returns the topside projection of this mesh
   *
   * @returns the path of this mesh
   */
  public projectTopSide(): paper.Item {
    return this.projection;
  }

  /**
   * Returns the downside projection of this mesh
   *
   * @returns the path of this mesh
   */
  public projectDownSide(): paper.Item {
    return this.projection;
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
    this.mesh.parent = this.transform;
  }

  /**
   * projection of the rectangle into 2d
   */
  protected createProjection() {
    this.projection = new Path({
      strokeColor: COLOR_STROKE,
      fillColor: null,
    });

    this.projection.add(
      new Point(this.positions[0], this.positions[1]),
      new Point(this.positions[9], this.positions[10]),
      new Point(this.positions[6], this.positions[7]),
      new Point(this.positions[3], this.positions[4])
    );

    this.projection.closed = true;
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

  protected registerEvents() {
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

    this.mesh.actionManager = new ActionManager(this.mesh.getScene());

    let moveEvent: Nullable<Observer<PointerInfo>>;

    function getMoveEvent(): Nullable<Observer<PointerInfo>> {
      return moveEvent;
    }

    let outPointerInfo: PointerInfo;

    const triggerOnMouseDown = new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (evt) => {
      if (!this.isRayFromFront(evt)) {
        return;
      }

      // if there is an old instance of moveEvent, remove it
      if (moveEvent) {
        this.mesh.getScene().onPointerObservable.remove(moveEvent);
      }

      // when mouse down is pressed create a new moveEvent
      moveEvent = this.mesh.getScene().onPointerObservable.add((pointerInfo) => {
        // check for pointer move events
        if (pointerInfo.type === PointerEventTypes.POINTERMOVE && pointerInfo.event.buttons === 1) {
          /** somehow, this is necessary, as the pointermove event gets
           * fired twice, but we only want to propagate it one time
           */
          if (
            outPointerInfo &&
            outPointerInfo.event.offsetX === pointerInfo.event.offsetX &&
            outPointerInfo.event.offsetY === pointerInfo.event.offsetY
          ) {
            return;
          }
          outPointerInfo = pointerInfo;
          this.onMouseMove.next({ face: this, event: pointerInfo });
        }

        // check for pointer up events and delete this event
        if (pointerInfo.type === PointerEventTypes.POINTERUP) {
          const _moveEvent = getMoveEvent();
          if (_moveEvent) {
            _moveEvent.unregisterOnNextCall = true;
          }
          this.onMouseUp.next({ face: this, event: pointerInfo });
        }
      });

      this.mesh.getScene().onPointerUp;
      this.onMouseDown.next({ face: this, event: evt });
    });
    this.executeActionList.push(triggerOnMouseDown);
    this.mesh.actionManager.registerAction(triggerOnMouseDown);
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
    const offsetWidth = width / 2;
    this.projection.segments[0].point.x = -offsetWidth;
    this.projection.segments[1].point.x = -offsetWidth;
    this.projection.segments[2].point.x = offsetWidth;
    this.projection.segments[3].point.x = offsetWidth;
  }

  private updateProjectionHeight(height: number) {
    this.projection.segments[1].point.y = height;
    this.projection.segments[2].point.y = height;
  }

  /**
   * checks, whether the ray came from the front side
   * or the back side of the plane
   *
   * @param evt action event with mouse coordinates
   * @returns true, if ray came from front, else false
   */
  protected isRayFromFront(evt: ActionEvent): boolean {
    const pickInfo = this.mesh.getScene().pick(evt.pointerX, evt.pointerY);
    if (!pickInfo) return false;
    const rayDirection = pickInfo.ray?.direction;
    const normalDirection = pickInfo.getNormal(true);
    if (rayDirection != null && normalDirection != null) {
      if (Vector3.Dot(rayDirection, normalDirection) > 0) {
        return false;
      }
    }
    return true;
  }
}
