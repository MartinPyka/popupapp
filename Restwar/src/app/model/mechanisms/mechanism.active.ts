import { BehaviorSubject } from 'rxjs';
import { HingeActive } from '../hinges/hinge.active';
import { PlaneRectangle } from '../planes/plane.rectangle';
import { Mechanism } from './mechanism';

export class MechanismActive extends Mechanism {
  // Model parameters

  /** the left angle to which the hinge is opened */
  public readonly leftAngle: BehaviorSubject<number>;

  /** the right angle to which the hinge is opened */
  public readonly rightAngle: BehaviorSubject<number>;

  // internal settings
  centerHinge: HingeActive;
  leftSide: PlaneRectangle;
  rightSide: PlaneRectangle;
}
