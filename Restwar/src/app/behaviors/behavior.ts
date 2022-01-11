import { Mechanism } from '../model/mechanisms/mechanism';
import { IDisposable } from '@babylonjs/core';
import { Subscription } from 'rxjs';
import { IModelDisposable } from '../model/interfaces/interfaces';

/** abstract and generic class for all kinds of behaviors */
export abstract class Behavior implements IModelDisposable {
  readonly subscriptionList: Subscription[];

  constructor(mechanism: Mechanism) {
    this.subscriptionList = [];
  }

  dispose(): void {
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
    this.subscriptionList.length = 0;
  }
}
