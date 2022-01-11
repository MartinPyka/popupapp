import { Type } from '@angular/core';
import { ActionEvent, IDisposable } from '@babylonjs/core';
import { Subscription } from 'rxjs';
import { Behavior } from 'src/app/behaviors/behavior';
import { Face } from '../abstract/face';
import { Plane } from '../abstract/plane';
import { Mechanism } from '../mechanisms/mechanism';

/**
 * Extends the IDisposable interface of Babylon by an
 * object that holds all subscriptions
 */
export interface IModelDisposable extends IDisposable {
  readonly subscriptionList: Subscription[];
}

/**
 * Interface for managing behaviors
 */
export interface IBehaviorCollection {
  /** list of behaviors */
  readonly behaviorList: Behavior[];

  /**
   * using generics in this manner allows the user to enter a type
   * into the function and this method takes care of creating the
   * instance, e.g.:
   *
   * .addBehavior(BehaviorBookletControl);
   */

  /**
   * Adds a behavior to the list. If it exist, the existing one
   * will be returned.
   * @param type Type of the behavior to be added
   * @returns instance of the behavior
   */
  addBehavior(type: Type<Behavior>): Behavior;

  /**
   * Returns the behavior from the list
   * @param type Type of the behavior
   * @returns the instance of the behavior if it exists
   */
  getBehavior(type: Type<Behavior>): Behavior | null;

  /**
   * removes the behavior from the list, if it exists
   * @param type the behavior to be removed
   */
  removeBehavior(type: Type<Behavior>): void;
}

/**
 * Interface for a face click event (can be also down or up event)
 */
export interface FaceClick {
  face: Face;
  event: ActionEvent;
}

/**
 * Interface for a plane click event
 */
export interface PlaneClick extends FaceClick {
  plane: Plane;
}

/**
 * Interface for a mechanism click event
 */
export interface MechanismClick extends PlaneClick {
  mechanism: Mechanism;
}
