import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Object3D } from '../abstract/object3d';
import { TransformObject3D } from '../abstract/transform.object3d';
import { IModelDisposable, MechanismClick } from '../interfaces/interfaces';

/**
 * Generic class for all kinds of mechanisms
 */
export abstract class Mechanism extends Object3D {
  public readonly onPickDown: Subject<MechanismClick>;

  constructor() {
    super();
    this.onPickDown = new Subject<MechanismClick>();
  }
}
