import { BehaviorBookletControl } from '../behaviors/mechanism/Behavior.BookletControl';
import { MechanismActive } from '../model/mechanisms/mechanism.active';

/**
 * static methods for creating default constructions
 */
export class ConstructionService {
  public static createActiveMechanism(): MechanismActive {
    const mecActive = new MechanismActive(null);
    mecActive.leftAngle.next(-45);
    mecActive.rightAngle.next(-60);
    mecActive.addBehavior(BehaviorBookletControl);

    return mecActive;
  }
}
