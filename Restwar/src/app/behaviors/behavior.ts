import { Mechanism } from '../model/mechanisms/mechanism';

/** abstract and generic class for all kinds of behaviors */
export abstract class Behavior {
  protected mechanism: Mechanism;

  constructor(mechanism: Mechanism) {
    this.mechanism = mechanism;
  }
}
