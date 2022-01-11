import { Type } from '@angular/core';
import { passCubePixelShader } from '@babylonjs/core/Shaders/passCube.fragment';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Behavior } from 'src/app/behaviors/behavior';
import { BehaviorBookletControl } from 'src/app/behaviors/mechanism/Behavior.BookletControl';
import { Object3D } from '../abstract/object3d';
import { TransformObject3D } from '../abstract/transform.object3d';
import { IBehaviorCollection, IModelDisposable, MechanismClick } from '../interfaces/interfaces';

/**
 * Generic class for all kinds of mechanisms
 */
export abstract class Mechanism extends Object3D implements IBehaviorCollection {
  public readonly onPickDown: Subject<MechanismClick>;

  private _behaviorList: Behavior[];

  public get behaviorList(): Behavior[] {
    return this._behaviorList;
  }

  constructor() {
    super();
    this.onPickDown = new Subject<MechanismClick>();
    this._behaviorList = [];
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
