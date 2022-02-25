import { BehaviorSubject, takeUntil } from 'rxjs';
import { Hinge } from '../hinges/hinge';
import { MechanismFolding } from './mechanism.folding';

const DEFAULT_DISTANCE_LEFT: number = 2;
const DEFAULT_DISTANCE_RIGHT: number = 2;
const DEFAULT_HEIGHT: number = 4;

/**
 *   This is the parallelogram, which can be used for all sorts of triangle
 *   shapes or as mechanism to simply create two off-centered hinges.
 *
 *  The basic model of this parallelogram looks like this (on 180 degree hinge):
 *
 *              ._____
 *           d .|      ______   b
 *            . | h           ________
 *           .  |                     ______
 *          (-------------------------x-----------)
 *              c (LeftDistance)            a (RightDistance)
 *   ===================================================================
 *                                    ^
 *   Offset-value x is the shift on the x-axis to the fold
 *
 *   a and c are defined as
 *   a = RightDistance
 *   c = Left Distance
 *
 *   b and d are defined as
 *   b = c + v
 *   d = a + v
 */
export class MechanismParallel extends MechanismFolding {
  // model parameters

  /**
   * distance of the left plane to the parent hinge
   */
  public readonly leftDistance: BehaviorSubject<number>;

  /**
   * distance of the right plane to the parent hinge
   */
  public readonly rightDistance: BehaviorSubject<number>;

  /**
   * height of the overall mechanism
   */
  public readonly height: BehaviorSubject<number>;

  // internal model parameters
  protected b_side: number = 0;
  protected d_side: number = 0;

  constructor(parent: Hinge) {
    super(parent);

    this.leftDistance = new BehaviorSubject<number>(DEFAULT_DISTANCE_LEFT);
    this.rightDistance = new BehaviorSubject<number>(DEFAULT_DISTANCE_RIGHT);
    this.height = new BehaviorSubject<number>(DEFAULT_HEIGHT);

    this.registerEvents();
  }

  /**
   * register all necessary events in order to handle modifications
   * of the model parameters
   */
  private registerEvents() {
    this.leftDistance.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.leftHinge.transform.position.y = value;
      this.calcModelVariable();
    });

    this.rightDistance.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.rightHinge.transform.position.y = value;
      this.calcModelVariable();
    });

    this.height.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.calcModelVariable();
    });
  }

  /**
   * Calculates the length b and d of the triangle as a result of the equation system
   */
  protected calcModelVariable() {
    if (this.foldingForm.getValue().LeftSideSwitch == this.foldingForm.getValue().RightSideSwitch) {
      if (!this.foldingForm.getValue().TopFoldSwitch) {
        this.calc0to180();
      } else {
        this.calc360to180();
      }
    } else {
      this.calc180to0And180to360();
    }

    this.leftSide.height.next(this.d_side);
    this.rightSide.height.next(this.b_side);
  }

  /**
   * Calculates the length of b and d based on rules that apply for 0 to 180 movements
   */
  protected calc0to180() {
    //  TODO: Use the height-parameter as real height value and not just as offset
    this.b_side = this.leftDistance.getValue() + this.height.getValue();
    this.d_side = this.rightDistance.getValue() + this.height.getValue();
  }

  /**
   * Calculates the length of b and d based on rules that apply for
   * 360 to 180 movement. Here, a - b = c - d, which means
   * LeftDistance - d_side = RightDistance - b_side
   */
  protected calc360to180() {
    this.b_side = this.rightDistance.getValue() + this.height.getValue();
    this.d_side = this.leftDistance.getValue() + this.height.getValue();
  }

  /**
   * for this mode, the position of the top fold and thereby the length
   * of b and d is determined by the Height value, which is here used as
   * a value that determines the percentage of length assigned to b and d
   * Height ~ 0.0 means the fold is very close to the left side (d ~ zero)
   * and Height ~ 1.0 means, the fold is very close to right side (b is
   * almost zero)
   */
  protected calc180to0And180to360() {
    const length = this.leftDistance.getValue() + this.rightDistance.getValue();
    this.b_side = (1 - this.height.getValue()) * length;
    this.d_side = this.height.getValue() * length;
  }
}
