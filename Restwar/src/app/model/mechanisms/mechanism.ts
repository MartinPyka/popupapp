import { BehaviorSubject, Subscription } from 'rxjs';
import { Object3D } from '../abstract/object3d';
import { IModelDisposable } from '../interfaces/interfaces';

/**
 * Generic class for all kinds of mechanisms
 */
export abstract class Mechanism extends Object3D implements IModelDisposable {
  readonly subscriptionList: Subscription[];
  dispose(): void {}
}
