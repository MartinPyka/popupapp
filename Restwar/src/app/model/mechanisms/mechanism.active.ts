import { BehaviorSubject } from 'rxjs';
import { TransformObject3D } from '../abstract/transform.object3d';
import { HingeActive } from '../hinges/hinge.active';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { Mechanism } from './mechanism';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/core/editor-service';
import { IProjectable } from '../interfaces/interfaces';
import { Group } from 'paper';
import { Point } from 'paper/dist/paper-core';

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

  protected projectionTop: paper.Group;
  protected projectionDown: paper.Group;

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

    this.projectionTop = new Group([
      new Group(this.leftSide.projectTopSide()),
      new Group(this.rightSide.projectTopSide()),
    ]);
    //this.projectionDown = new Group([this.leftSide.projectDownSide(), this.rightSide.projectDownSide()]);

    this.configureProjectionSetting(this.projectionTop);
    this.projectionTop.position = new Point(150, 120);

    //this.projectionDown.applyMatrix = false;
    //this.projectionDown.position = new Point(200, 50);

    this.registerEvents();
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

    this.subscriptionList.push(
      this.leftSide.onMouseDown.subscribe((planeClick) => this.onMouseDown.next({ ...planeClick, mechanism: this }))
    );

    this.subscriptionList.push(
      this.rightSide.onMouseDown.subscribe((planeClick) => this.onMouseDown.next({ ...planeClick, mechanism: this }))
    );
  }
}
