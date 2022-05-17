import { Vector3 } from '@babylonjs/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AppInjector } from 'src/app/app.module';
import { EditorService } from 'src/app/services/editor.service';
import { calc_triangle_angle } from 'src/app/utils/math';
import { Hinge } from '../hinges/hinge';
import { FoldForm } from '../types/FoldForm';
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

  /** length of the b-side of the triangle */
  protected b_side: number = 0;

  /** length of the d-side of the triangle */
  protected d_side: number = 0;

  /**
   * angle of the triangle consisting of the side d and c
   */
  protected alpha: number;

  /**
   * angle of the triangle consisting of the side b and a
   */
  protected beta: number;

  protected alpha_under: number;
  protected beta_under: number;

  /**
   * rotation of the left hinge to look at the top fold
   */
  protected fold_angle_alpha: number;

  /**
   * rotation of the right hinge to look at the top fold
   */
  protected fold_angle_beta: number;

  constructor(parent: Hinge) {
    super(parent);

    this.leftDistance = new BehaviorSubject<number>(DEFAULT_DISTANCE_LEFT);
    this.rightDistance = new BehaviorSubject<number>(DEFAULT_DISTANCE_RIGHT);
    this.height = new BehaviorSubject<number>(DEFAULT_HEIGHT);

    this.registerEvents();
    const editorSerivce = AppInjector.get(EditorService);
    const scene = editorSerivce.scene;
    scene.onBeforeRenderObservable.add(() => {
      this.calcFoldPosition();
    });
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

    this.foldingForm.pipe(takeUntil(this.onDispose)).subscribe((value) => {
      this.calcAxisOrientation(value);
    });
  }

  /**
   * Updates the orientation of the hinge transforms depending on the current foldform
   */
  protected calcAxisOrientation(foldForm: FoldForm) {
    if (foldForm.LeftSideSwitch == false && foldForm.RightSideSwitch == false && foldForm.TopFoldSwitch == false) {
      this.leftHinge.setTransformOrientation(true, true, true);
      this.rightHinge.setTransformOrientation(true, true, false);
    }
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

  /**
   * Updates the orientation of the hinges
   */
  protected updateHingeOrientation() {}

  protected calcFoldPosition() {
    // calc distance between both hinges in world coordinates
    const hinge_distance = this.leftHinge.transform.absolutePosition
      .subtract(this.rightHinge.transform.absolutePosition)
      .length();
    // calculate angle alpha (left corner) which opposes the b-side
    this.alpha = calc_triangle_angle(this.b_side, this.d_side, hinge_distance);
    // calculate the angle between distance and the plane on the left side
    this.alpha_under = calc_triangle_angle(this.rightDistance.getValue(), this.leftDistance.getValue(), hinge_distance);

    // calculate angle beta (left corner) which opposes the d-side
    this.beta = calc_triangle_angle(this.d_side, this.b_side, hinge_distance);
    // calculate the angle between distance and the plane on the right side
    this.beta_under = calc_triangle_angle(this.leftDistance.getValue(), this.rightDistance.getValue(), hinge_distance);

    if (this.foldingForm.getValue().TopFoldSwitch) {
      this.fold_angle_alpha = this.alpha - this.alpha_under;
      this.fold_angle_beta = this.beta - this.beta_under;
    } else {
      this.fold_angle_alpha = this.alpha + this.alpha_under;
      this.fold_angle_beta = this.beta + this.beta_under;
    }

    if (this.foldingForm.getValue().LeftSideSwitch == this.foldingForm.getValue().RightSideSwitch) {
      this.calcFoldPosition0to180And360to180();
    } else {
      this.calcFoldPosition180to0();
    }
  }

  protected calcFoldPosition0to180And360to180() {
    this.leftHinge.rightAngle = -180 + this.fold_angle_alpha;
    this.rightHinge.leftAngle = -180 + this.fold_angle_beta;
    /*
    this.LeftSide.transform.localRotation = 
        Quaternion.Euler(
            (FoldingForm.TopFoldSwitch ? ((Height > 0) ? 1 : -1) : -1) * fold_angle_alpha + ((FoldingForm.TopFoldSwitch) ? 1 : 0) * 180, 
            parallelogramDefaultAngle, 
            0.0f);
    RightSide.transform.localRotation = 
        Quaternion.Euler(
            (FoldingForm.TopFoldSwitch ? ((Height > 0) ? 1 : -1) : -1) * fold_angle_beta + ((FoldingForm.TopFoldSwitch) ? 1 : 0) * 180,
            parallelogramDefaultAngle, 
            0.0f);
          */
  }

  protected calcFoldPosition180to0() {
    /*
    LeftSide.transform.localRotation = 
        Quaternion.Euler(
            (FoldingForm.TopFoldSwitch ? (leftSideLonger ? -1 : 1) : 1) * fold_angle_alpha + -180, 
            parallelogramDefaultAngle, 
            0.0f);
    RightSide.transform.localRotation = 
        Quaternion.Euler(
            (FoldingForm.TopFoldSwitch ? (!leftSideLonger ? -1 : 1) : 1) * fold_angle_beta + -180,
            parallelogramDefaultAngle, 
            0.0f);
            */
  }
}
