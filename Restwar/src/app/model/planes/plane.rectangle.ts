import { Scene, TransformNode } from '@babylonjs/core';
import { BehaviorSubject } from 'rxjs';
import { Plane } from '../abstract/plane';
import { TransformObject3D } from '../abstract/transform.object3d';
import { FaceRectangle } from '../faces/face.rectangle';
import { IProjectable } from '../interfaces/interfaces';

// this constant is used in order to facilitate face picking based
// on the scene picking method which relies on bounding boxes. If
// both faces line up perfectly, there is a problem in picking the
// one facing to the camera
const OFFSET_FACE = 0.001;

/**
 * Rectangle plane, that can be used e.g. for book shelfs or
 * parallelograms
 */
export class PlaneRectangle extends Plane implements IProjectable {
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
  public projectTopSide(): paper.Item {
    return this.topSide.projectTopSide();
  }

  /**
   * Returns the downside projection of this plane
   *
   * @returns
   */
  public projectDownSide(): paper.Item {
    return this.downSide.projectDownSide();
  }

  /**
   * Registers all events in order to control this plane
   */
  protected registerPropertyEvents() {
    // handle events for width changes
    this.subscriptionList.push(
      this.width.subscribe((width) => {
        this.topSide.width.next(width);
        this.downSide.width.next(width);
      })
    );

    // handle vents for height changes
    this.subscriptionList.push(
      this.height.subscribe((height) => {
        this.topSide.height.next(height);
        this.downSide.height.next(height);
      })
    );
  }

  /**
   * registers all events that are related to mouse or click events
   */
  protected registerInputEvents() {
    this.subscriptionList.push(
      this.topSide.onMouseDown.subscribe((faceClick) => this.onMouseDown.next({ ...faceClick, plane: this })),
      this.topSide.onMouseUp.subscribe((faceClick) => this.onMouseUp.next({ ...faceClick, plane: this })),
      this.topSide.onMouseMove.subscribe((faceMove) => this.onMouseMove.next({ ...faceMove, plane: this }))
    );

    this.subscriptionList.push(
      this.downSide.onMouseDown.subscribe((faceClick) => this.onMouseDown.next({ ...faceClick, plane: this })),
      this.downSide.onMouseUp.subscribe((faceClick) => this.onMouseUp.next({ ...faceClick, plane: this })),
      this.downSide.onMouseMove.subscribe((faceMove) => this.onMouseMove.next({ ...faceMove, plane: this }))
    );
  }

  override dispose(): void {
    super.dispose();
    this.height.complete();
    this.width.complete();
  }
}
