import { Scene, TransformNode } from '@babylonjs/core';
import { BehaviorSubject } from 'rxjs';
import { Plane } from '../abstract/plane';
import { TransformObject3D } from '../abstract/transform.object3d';
import { FaceRectangle } from '../faces/face.rectangle';

// this constant is used in order to facilitate face picking based
// on the scene picking method which relies on bounding boxes. If
// both faces line up perfectly, there is a problem in picking the
// one facing to the camera
const OFFSET_FACE = 0.001;

/**
 * Rectangle plane, that can be used e.g. for book shelfs or
 * parallelograms
 */
export class PlaneRectangle extends Plane {
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
      this.topSide.onPickDown.subscribe((faceClick) => {
        this.onPickDown.next({ ...faceClick, plane: this });
      })
    );

    this.subscriptionList.push(
      this.downSide.onPickDown.subscribe((faceClick) => {
        this.onPickDown.next({ ...faceClick, plane: this });
      })
    );
  }

  override dispose(): void {
    super.dispose();
    this.height.complete();
    this.width.complete();
  }
}
