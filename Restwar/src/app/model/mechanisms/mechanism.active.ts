import { BehaviorSubject, pipe, takeUntil } from 'rxjs';
import { TransformObject3D } from '../abstract/transform.object3d';
import { HingeActive } from '../hinges/hinge.active';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { AppInjector } from 'src/app/app.module';
import { IProjectable } from '../interfaces/interfaces';
import { Vector3 } from 'babylonjs';
import { BasicRenderService } from 'src/app/services/BasicRenderService';
import { ProjectionActive } from 'src/app/projection/projection.active';
import { MechanismFolding } from './mechanism.folding';

const DEFAULT_ANGLE_LEFT = 90;
const DEFAULT_ANGLE_RIGHT = 90;
const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

/**
 * The active mechanism can be modified by the user directly. The user
 * applies the force directly to the mechanism. E.g. book-site
 */
export class MechanismActive extends MechanismFolding implements IProjectable {
  // Model parameters

  /** the left angle to which the hinge is opened */
  public leftAngle: BehaviorSubject<number>;

  /** the right angle to which the hinge is opened */
  public rightAngle: BehaviorSubject<number>;

  /** height of the planes
   */
  public height: BehaviorSubject<number>;

  // projection assets
  protected projectionTop: paper.Group;
  protected projectionDown: paper.Group;
  protected pathFoldLine: paper.Path;

  constructor(parent: TransformObject3D | null) {
    super(parent);
  }

  protected override initializationSteps(parent: TransformObject3D | null) {
    super.initializationSteps(parent);
    const basicRenderService = AppInjector.get(BasicRenderService);
    const scene = basicRenderService.scene;

    // create model parameters
    this.width = new BehaviorSubject<number>(DEFAULT_WIDTH);
    this.height = new BehaviorSubject<number>(DEFAULT_HEIGHT);
    this.leftAngle = new BehaviorSubject<number>(DEFAULT_ANGLE_LEFT);
    this.rightAngle = new BehaviorSubject<number>(DEFAULT_ANGLE_RIGHT);

    this.centerHinge = new HingeActive(parent, this, scene);
    this.leftSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.centerHinge.leftTransform);
    this.rightSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.centerHinge.rightTransform);

    this.leftSide.transform.rotation = new Vector3(0, Math.PI, 0);
    this.rightSide.transform.rotation = new Vector3(0, Math.PI, 0);

    this.projection = new ProjectionActive(this);
    this.registerEvents();
  }

  override dispose(): void {
    super.dispose();

    this.leftAngle.complete();
    this.rightAngle.complete();
    this.width.complete();
    this.height.complete();

    this.centerHinge.dispose();
    this.leftSide.dispose();
    this.rightSide.dispose();
  }

  public override projectTopSide(): paper.Item {
    return this.projectionTop;
  }

  public override projectDownSide(): paper.Item {
    return this.projectionDown;
  }

  /**
   * registers all events for changing the model parameter and for reacting
   * to click events
   */
  protected registerEvents() {
    this.leftAngle.pipe(takeUntil(this.onDispose)).subscribe((value) => (this.centerHinge.leftAngle = value));

    this.rightAngle.pipe(takeUntil(this.onDispose)).subscribe((value) => (this.centerHinge.rightAngle = value));

    this.width.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.leftSide.width.next(value);
      this.rightSide.width.next(value);
      this.centerHinge.width = value;
    });

    this.height.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.leftSide.height.next(value);
      this.rightSide.height.next(value);
    });

    this.leftSide.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((planeClick) => this.onFaceDown.next({ ...planeClick, mechanism: this }));

    this.rightSide.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((planeClick) => this.onFaceDown.next({ ...planeClick, mechanism: this }));

    this.centerHinge.onMouseDown
      .pipe(takeUntil(this.onDispose))
      .subscribe((hingeClick) => this.onHingeDown.next({ ...hingeClick, mechanism: this }));
  }
}
