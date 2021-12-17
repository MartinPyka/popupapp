import { IDisposable } from '@babylonjs/core';
import { Subscription } from 'rxjs';

/**
 * Extends the IDisposable interface of Babylon by an
 * object that holds all subscriptions
 */
export interface IModelDisposable extends IDisposable {
  readonly subscriptionList: Subscription[];
}
