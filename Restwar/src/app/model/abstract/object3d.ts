import { v4 } from 'uuid';

/**
 * This is the most basic class for any 3d object in this application.
 * Every 3d object that is a combination of model parameters and its
 * 3d view representation and that should be serializable, should reference
 * this class.
 */
export abstract class Object3D {
  // every object has a unique id so that it can be referenced
  // in a deserialized state
  readonly id: string;

  constructor() {
    this.id = v4();
  }
}
