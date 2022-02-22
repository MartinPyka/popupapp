import { BehaviorSubject } from 'rxjs';
import { Hinge } from '../hinges/hinge';
import { HingeActive } from '../hinges/hinge.active';
import { IProjectable } from '../interfaces/interfaces';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { FoldForm } from '../types/FoldForm';
import { Mechanism } from './mechanism';

/**
 * generic class for all kinds of folding mechanisms
 */
export class MechanismFolding extends Mechanism implements IProjectable {
  // generic model parameters

  /**
   * offset on the hinge axis
   */
  public readonly offset: BehaviorSubject<number>;

  /**
   * folding form that determines on which side of the
   * parent hinge this mechanism should sit
   */
  public readonly FoldingForm: BehaviorSubject<FoldForm>;

  /**
   * hinge to which this mechanism is attached to
   */
  parentHinge: Hinge;

  /**
   * the hinges this mechanism creates
   */
  leftHinge: HingeActive;
  topHinge: HingeActive;
  rightHinge: HingeActive;

  /**
   * left and right side that represents the geometry of the fold.
   * This can be used to for projections but it could also be hidden.
   */
  leftSide: PlaneRectangle;
  rightSide: PlaneRectangle;

  constructor(parent: Hinge) {
    super();

    this.parentHinge = parent;
  }

  override dispose(): void {
    super.dispose();
    this.parentHinge.dispose();
    this.leftHinge.dispose();
    this.topHinge.dispose();
    this.rightHinge.dispose();
    this.leftSide.dispose();
    this.rightSide.dispose();

    this.offset.complete();
  }

  public projectTopSide(): paper.Item {
    return new paper.Item();
  }

  public projectDownSide(): paper.Item {
    return new paper.Item();
  }
}
