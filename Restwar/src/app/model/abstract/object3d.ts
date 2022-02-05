import { ExecuteCodeAction } from '@babylonjs/core';
import { Subject, Subscription } from 'rxjs';
import { v4 } from 'uuid';
import { IModelDisposable } from '../interfaces/interfaces';

/**
 * This is the most basic class for any 3d object in this application.
 * Every 3d object that is a combination of model parameters and its
 * 3d view representation and that should be serializable, should reference
 * this class.
 */
export abstract class Object3D implements IModelDisposable {
  // every object has a unique id so that it can be referenced
  // in a deserialized state
  readonly id: string;

  // an event that fires, when the Object3D is diposed
  readonly onDispose: Subject<void>;

  constructor() {
    this.id = v4();
    this.onDispose = new Subject<void>();
  }

  dispose(): void {
    this.onDispose.next();
    this.onDispose.complete();
  }
}
