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
  public readonly behaviorList: Behavior[];

  constructor() {
    super();
    this.onPickDown = new Subject<MechanismClick>();
    this.behaviorList = [];
    this.test(BehaviorBookletControl);
    //this.getBehavior(BehaviorBookletControl);
  }

  public test<T extends Behavior>(type: Type<T>): T {
    const behavior = new type(this);
    this.behaviorList.push(behavior);
    return behavior;
  }

  public addBehavior<T extends Behavior>(c: new (mechanism: Mechanism) => T): T {
    // first, check, whether the behavior already exists
    const behavior = new c(this);
    this.behaviorList.push(behavior);
    return behavior;
  }

  public getBehavior<T extends Behavior>(c: new (mechanism: Mechanism) => T): T | null {
    let result: T | null = null;
    console.log(c.toString());
    this.behaviorList.forEach((behavior) => {
      console.log(behavior.toString());
      if (behavior.toString() === c.toString()) {
        result = behavior as T;
      }
    });
    return result;
  }

  public removeBehavior<T extends Behavior>(c: new (mechanism: Mechanism) => T): void {}
}
