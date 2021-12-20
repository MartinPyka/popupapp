import { ActionEvent, IDisposable } from '@babylonjs/core';
import { Subscription } from 'rxjs';
import { Face } from '../abstract/face';
import { Plane } from '../abstract/plane';

/**
 * Extends the IDisposable interface of Babylon by an
 * object that holds all subscriptions
 */
export interface IModelDisposable extends IDisposable {
  readonly subscriptionList: Subscription[];
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
export interface PlaneClick {
  plane: Plane;
  face: Face;
  event: ActionEvent;
}
