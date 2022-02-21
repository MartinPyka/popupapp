import { Type } from '@angular/core';
import { ActionEvent, IDisposable, PointerInfo } from '@babylonjs/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Behavior } from 'src/app/behaviors/behavior';
import { Face } from '../abstract/face';
import { Plane } from '../abstract/plane';
import { Mechanism } from '../mechanisms/mechanism';

/**
 * Extends the IDisposable interface of Babylon by an
 * a subject that fires, when the instance is disposed
 */
export interface IModelDisposable extends IDisposable {
  readonly onDispose: Subject<void>;
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
 * Interface for all classes which provide points that
 * can be used for 2d projections
 */
export interface IProjectionPoints {
  projectionPointsTopSide(): BehaviorSubject<paper.Point[]>;
  projectionPointsDownSide(): BehaviorSubject<paper.Point[]>;
  projectionPointsTopSideValue(): paper.Point[];
  projectionPointsDownSideValue(): paper.Point[];
}

/**
 * Interface for all classes which can be projected into
 * 2d paper space
 */
export interface IProjectable {
  projectTopSide(): paper.Item;
  projectDownSide(): paper.Item;
}

/**
 * Interface for all click events an object can have
 */
export interface IClickable {
  onMouseDown: Subject<any>;
  onMouseUp: Subject<any>;
  onMouseMove: Subject<any>;
}

export interface Click {
  event: ActionEvent;
}

/**
 * Interface for a face click event (can be also down or up event)
 */
export interface FaceClick extends Click {
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

/**
 * Interface for a face movement event
 */
export interface FaceMove {
  face: Face;
  event: PointerInfo;
}

/**
 * Interface for a face up event
 */
export interface FaceUp {
  face: Face;
  event: PointerInfo;
}

/**
 * Interface for a plane movement event
 */
export interface PlaneMove extends FaceMove {
  plane: Plane;
}

export interface PlaneUp extends FaceUp {
  plane: Plane;
}
