import { Mechanism } from '../model/mechanisms/mechanism';
import { IDisposable } from '@babylonjs/core';
import { Subscription } from 'rxjs';
import { IModelDisposable } from '../model/interfaces/interfaces';
import { CommandInvoker } from '../core/undo/CommandInvoker';
import { AppInjector } from '../app.module';

/** abstract and generic class for all kinds of behaviors */
export abstract class Behavior implements IModelDisposable {
  readonly subscriptionList: Subscription[];
  protected readonly commandInvoker: CommandInvoker;

  constructor(mechanism: Mechanism) {
    this.subscriptionList = [];
    this.commandInvoker = AppInjector.get(CommandInvoker);
  }

  dispose(): void {
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
    this.subscriptionList.length = 0;
  }
}
