import { BehaviorSubject } from 'rxjs';
import { MechanismFolding } from './mechanism.folding';

/**
 * the parallelogram fold
 */
export class MechanismParallel extends MechanismFolding {
  // model parameters

  /**
   * distance of the left plane to the parent hinge
   */
  public readonly LeftDistance: BehaviorSubject<number>;

  /**
   * distance of the right plane to the parent hinge
   */
  public readonly RightDistance: BehaviorSubject<number>;

  /**
   * height of the overall mechanism
   */
  public readonly Height: BehaviorSubject<number>;
}
