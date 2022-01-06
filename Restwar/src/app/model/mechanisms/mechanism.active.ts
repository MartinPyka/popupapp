import { CubeMapToSphericalPolynomialTools, Scene } from '@babylonjs/core';
import { BehaviorSubject } from 'rxjs';
import { TransformObject3D } from '../abstract/transform.object3d';
import { HingeActive } from '../hinges/hinge.active';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { Mechanism } from './mechanism';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';

const DEFAULT_ANGLE_LEFT = 90;
const DEFAULT_ANGLE_RIGHT = 90;
const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

/**
 * The active mechanism can be modified by the user directly. The user
 * applies the force directly to the mechanism. E.g. book-site
 */
export class MechanismActive extends Mechanism {
  // Model parameters

  /** the left angle to which the hinge is opened */
  public readonly leftAngle: BehaviorSubject<number>;

  /** the right angle to which the hinge is opened */
  public readonly rightAngle: BehaviorSubject<number>;

  /** width of the planes */
  public readonly width: BehaviorSubject<number>;

  /** height of the planes */
  public readonly height: BehaviorSubject<number>;

  // internal settings
  centerHinge: HingeActive;
  leftSide: PlaneRectangle;
  rightSide: PlaneRectangle;

  constructor(parent: TransformObject3D | null) {
    super();

    const editorService = AppInjector.get(EditorService);
    const scene = editorService.scene;

    // create model parameters
    this.width = new BehaviorSubject<number>(DEFAULT_WIDTH);
    this.height = new BehaviorSubject<number>(DEFAULT_HEIGHT);
    this.leftAngle = new BehaviorSubject<number>(DEFAULT_ANGLE_LEFT);
    this.rightAngle = new BehaviorSubject<number>(DEFAULT_ANGLE_RIGHT);

    this.centerHinge = new HingeActive(parent, scene);
    this.leftSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.centerHinge.leftTransform);
    this.rightSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.centerHinge.rightTransform);

    this.registerEvents();
  }

  private registerEvents() {
    this.subscriptionList.push(this.leftAngle.subscribe((value) => (this.centerHinge.leftAngle = value)));

    this.subscriptionList.push(this.rightAngle.subscribe((value) => (this.centerHinge.rightAngle = value)));

    this.subscriptionList.push(
      this.width.subscribe((value) => {
        this.leftSide.width.next(value);
        this.rightSide.width.next(value);
        this.centerHinge.width = value;
      })
    );

    this.subscriptionList.push(
      this.height.subscribe((value) => {
        this.leftSide.height.next(value);
        this.rightSide.height.next(value);
      })
    );
  }
}
