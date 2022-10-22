import { BehaviorSubject, pipe, takeUntil } from 'rxjs';
import { TransformObject3D } from '../abstract/transform.object3d';
import { HingeActive } from '../hinges/hinge.active';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { Mechanism } from './mechanism';
import { AppInjector } from 'src/app/app.module';
import { IProjectable } from '../interfaces/interfaces';
import { Path, Group, Point } from 'paper';
import * as projection from 'src/app/utils/projection';
import { Vector3 } from 'babylonjs';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

const DEFAULT_ANGLE_LEFT = 90;
const DEFAULT_ANGLE_RIGHT = 90;
const DEFAULT_WIDTH = 10;
const DEFAULT_HEIGHT = 10;

/**
 * The active mechanism can be modified by the user directly. The user
 * applies the force directly to the mechanism. E.g. book-site
 */
export class MechanismActive extends Mechanism implements IProjectable {
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

  // projection assets
  protected projectionTop: paper.Group;
  protected projectionDown: paper.Group;
  protected pathFoldLine: paper.Path;

  constructor(parent: TransformObject3D | null) {
    super();

    const basicRenderService = AppInjector.get(BasicRenderService);
    const scene = basicRenderService.scene;

    // create model parameters
    this.width = new BehaviorSubject<number>(DEFAULT_WIDTH);
    this.height = new BehaviorSubject<number>(DEFAULT_HEIGHT);
    this.leftAngle = new BehaviorSubject<number>(DEFAULT_ANGLE_LEFT);
    this.rightAngle = new BehaviorSubject<number>(DEFAULT_ANGLE_RIGHT);

    this.centerHinge = new HingeActive(parent, scene);
    this.leftSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.centerHinge.leftTransform);
    this.rightSide = new PlaneRectangle(DEFAULT_WIDTH, DEFAULT_HEIGHT, scene, this.centerHinge.rightTransform);

    this.leftSide.transform.rotation = new Vector3(0, Math.PI, 0);
    this.rightSide.transform.rotation = new Vector3(0, Math.PI, 0);

    this.createProjection();
    this.registerEvents();
  }

  createProjection() {
    this.pathFoldLine = new Path({
      strokeColor: 'black',
    });
    this.pathFoldLine.add(new Point(0, -this.width.getValue() / 2));
    this.pathFoldLine.add(new Point(0, this.width.getValue() / 2));
    this.pathFoldLine.style.dashArray = [2, 2];

    this.projectionTop = new Group([
      new Group(projection.createPathRectangleOpen(this.leftSide.projectionPointsTopSideValue())),
      new Group(projection.createPathRectangleOpen(this.rightSide.projectionPointsTopSideValue())),
      this.pathFoldLine,
    ]);

    this.projectionDown = new Group([
      new Group(projection.createPathRectangleOpen(this.leftSide.projectionPointsDownSideValue())),
      new Group(projection.createPathRectangleOpen(this.rightSide.projectionPointsDownSideValue())),
    ]);

    this.configureProjectionSetting(this.projectionTop);
    this.projectionTop.position = new Point(150, 100);

    this.configureProjectionSetting(this.projectionDown);
    this.projectionDown.position = new Point(150, 130);
  }

  /**
   * configures the layout of a paperjs group for an active mechanism
   */
  private configureProjectionSetting(group: paper.Group) {
    group.applyMatrix = false;

    group.children[0].applyMatrix = false;
    group.children[0].rotate(90);
    group.children[0].position = new Point(-5, 0);

    group.children[1].applyMatrix = false;
    group.children[1].rotate(-90);
    group.children[1].position = new Point(5, 0);
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

  public projectTopSide(): paper.Item {
    return this.projectionTop;
  }

  public projectDownSide(): paper.Item {
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

      this.pathFoldLine.segments[0].point.y = -value / 2;
      this.pathFoldLine.segments[1].point.y = value / 2;
    });

    this.height.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.leftSide.height.next(value);
      this.rightSide.height.next(value);
    });

    this.leftSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionTop.children[0].children[0] as paper.Path, points)
      );

    this.leftSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionDown.children[0].children[0] as paper.Path, points)
      );

    this.rightSide
      .projectionPointsTopSide()
      .pipe(takeUntil(this.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionTop.children[1].children[0] as paper.Path, points)
      );

    this.rightSide
      .projectionPointsDownSide()
      .pipe(takeUntil(this.onDispose))
      .subscribe((points) =>
        projection.updatePathRectangleOpen(this.projectionDown.children[1].children[0] as paper.Path, points)
      );

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
