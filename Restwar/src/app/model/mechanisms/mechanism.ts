import { Type } from '@angular/core';
import { Subject } from 'rxjs';
import { Behavior } from 'src/app/behaviors/behavior';
import { Object3D } from '../abstract/object3d';
import { IBehaviorCollection, IClickable, IModelDisposable, MechanismClick } from '../interfaces/interfaces';

/**
 * Generic class for all kinds of mechanisms
 */
export abstract class Mechanism extends Object3D implements IBehaviorCollection, IClickable {
  public readonly onMouseDown: Subject<MechanismClick>;
  public readonly onMouseUp: Subject<MechanismClick>;
  public readonly onMouseMove: Subject<MechanismClick>;

  private _behaviorList: Behavior[];

  public get behaviorList(): Behavior[] {
    return this._behaviorList;
  }

  constructor() {
    super();
    this.onMouseDown = new Subject<MechanismClick>();
    this._behaviorList = [];
  }

  override dispose(): void {
    super.dispose();

    this.behaviorList.forEach((behavior) => behavior.dispose());

    this.onMouseDown.complete();
    this.onMouseUp.complete();
    this.onMouseMove.complete();
  }

  /**
   * @inheritdoc
   */
  public addBehavior(type: Type<Behavior>): Behavior {
    const result = this.getBehavior(type);
    if (result) {
      return result;
    }

    const behavior = new type(this);
    this.behaviorList.push(behavior);
    return behavior;
  }

  /**
   * @inheritdoc
   */
  public getBehavior(type: Type<Behavior>): Behavior | null {
    const result = this.behaviorList.filter((behavior) => behavior.constructor.name === type.name);
    if (result.length === 0) {
      return null;
    } else {
      return result[0];
    }
  }

  /**
   * @inheritdoc
   */
  public removeBehavior(type: Type<Behavior>): void {
    const behavior = this.getBehavior(type);
    if (behavior) {
      behavior.dispose();
    }
    this._behaviorList = this.behaviorList.filter((behavior) => behavior.constructor.name != type.name);
  }
}
