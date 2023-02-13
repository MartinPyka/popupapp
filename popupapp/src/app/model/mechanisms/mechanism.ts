import { Type } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Behavior } from 'src/app/behaviors/behavior';
import { Projection } from 'src/app/projection/projection';
import { Object3D } from '../abstract/object3d';
import { IBehaviorCollection, MechanismFaceClick, MechanismHingeClick } from '../interfaces/interfaces';

/**
 * Generic class for all kinds of mechanisms
 */
export abstract class Mechanism extends Object3D implements IBehaviorCollection {
  public readonly onFaceDown: Subject<MechanismFaceClick>;
  public readonly onFaceUp: Subject<MechanismFaceClick>;
  public readonly onFaceMove: Subject<MechanismFaceClick>;

  public readonly onHingeDown: Subject<MechanismHingeClick>;
  public readonly onHingeUp: Subject<MechanismHingeClick>;
  public readonly onHingeMove: Subject<MechanismHingeClick>;

  // fires, when the mechanism becomes invisible
  public readonly onInvisible: Subject<void>;

  private _behaviorList: Behavior<Mechanism>[];

  public projection: Projection;

  public get behaviorList(): Behavior<Mechanism>[] {
    return this._behaviorList;
  }

  constructor() {
    super();
    this.onFaceDown = new Subject<MechanismFaceClick>();
    this.onFaceUp = new Subject<MechanismFaceClick>();
    this.onFaceMove = new Subject<MechanismFaceClick>();
    this.onHingeDown = new Subject<MechanismHingeClick>();
    this.onHingeUp = new Subject<MechanismHingeClick>();
    this.onHingeMove = new Subject<MechanismHingeClick>();
    this.onInvisible = new Subject<void>();
    this._behaviorList = [];
  }

  override dispose(): void {
    super.dispose();

    this.behaviorList.forEach((behavior) => behavior.dispose());
    this.projection.dispose();

    this.onFaceDown.complete();
    this.onFaceUp.complete();
    this.onFaceMove.complete();

    this.onHingeDown.complete();
    this.onHingeUp.complete();
    this.onHingeMove.complete();

    this.onInvisible.complete();
  }

  public override visible(value: boolean): void {
    super.visible(value);
    if (!value) {
      this.onInvisible.next();
    }
  }

  /**
   * @inheritdoc
   */
  public addBehavior(type: Type<Behavior<Mechanism>>): Behavior<Mechanism> {
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
  public getBehavior(type: Type<Behavior<Mechanism>>): Behavior<Mechanism> | null {
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
  public removeBehavior(type: Type<Behavior<Mechanism>>): void {
    const behavior = this.getBehavior(type);
    if (behavior) {
      behavior.dispose();
    }
    this._behaviorList = this.behaviorList.filter((behavior) => behavior.constructor.name != type.name);
  }

  abstract projectionGlueHintsLeft(): paper.Group;

  abstract projectionGlueHintsRight(): paper.Group;
}
