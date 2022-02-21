import { Scene, TransformNode } from '@babylonjs/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { Plane } from '../abstract/plane';
import { TransformObject3D } from '../abstract/transform.object3d';
import { FaceRectangle } from '../faces/face.rectangle';
import { IProjectable, IProjectionPoints } from '../interfaces/interfaces';

// this constant is used in order to facilitate face picking based
// on the scene picking method which relies on bounding boxes. If
// both faces line up perfectly, there is a problem in picking the
// one facing to the camera
const OFFSET_FACE = 0.001;

/**
 * Rectangle plane, that can be used e.g. for book shelfs or
 * parallelograms
 */
export class PlaneRectangle extends Plane implements IProjectionPoints {
  // Model parameters
  public readonly height: BehaviorSubject<number>;
  public readonly width: BehaviorSubject<number>;

  // internal settings
  protected override topSide: FaceRectangle;
  protected override downSide: FaceRectangle;

  constructor(width: number = 1, height: number = 1, scene: Scene, parent: TransformObject3D | null) {
    super(parent);
    this.topSide = new FaceRectangle(width, height, false, scene, this);
    this.downSide = new FaceRectangle(width, height, true, scene, this);

    // a temporary trick to make sure that both sides are pickable
    this.downSide.mesh.position.z = OFFSET_FACE;

    this.width = new BehaviorSubject<number>(width);
    this.height = new BehaviorSubject<number>(height);

    this.registerPropertyEvents();
    this.registerInputEvents();
  }

  /**
   * Returns the topside projection of this plane
   *
   * @returns
   */
  public projectionPointsTopSide(): paper.Point[] {
    return this.topSide.projectionPointsTopSide();
  }

  /**
   * Returns the downside projection of this plane
   *
   * @returns
   */
  public projectionPointsDownSide(): paper.Point[] {
    return this.downSide.projectionPointsDownSide();
  }

  /**
   * Registers all events in order to control this plane
   */
  protected registerPropertyEvents() {
    // handle events for width changes
    this.width.pipe(takeUntil(this.onDispose)).subscribe((width) => {
      this.topSide.width.next(width);
      this.downSide.width.next(width);
    });

    // handle vents for height changes
    this.height.pipe(takeUntil(this.onDispose)).subscribe((height) => {
      this.topSide.height.next(height);
      this.downSide.height.next(height);
    });
  }

  /**
   * registers all events that are related to mouse or click events
   */
  protected registerInputEvents() {
    this.topSide.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((faceClick) => this.onMouseDown.next({ ...faceClick, plane: this })),
      this.topSide.onMouseUp
        .pipe(takeUntil(this.onDispose))
        .subscribe((faceClick) => this.onMouseUp.next({ ...faceClick, plane: this })),
      this.topSide.onMouseMove
        .pipe(takeUntil(this.onDispose))
        .subscribe((faceMove) => this.onMouseMove.next({ ...faceMove, plane: this }));

    this.downSide.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((faceClick) => this.onMouseDown.next({ ...faceClick, plane: this })),
      this.downSide.onMouseUp
        .pipe(takeUntil(this.onDispose))
        .subscribe((faceClick) => this.onMouseUp.next({ ...faceClick, plane: this })),
      this.downSide.onMouseMove
        .pipe(takeUntil(this.onDispose))
        .subscribe((faceMove) => this.onMouseMove.next({ ...faceMove, plane: this }));
  }

  override dispose(): void {
    super.dispose();
    this.height.complete();
    this.width.complete();
  }
}
