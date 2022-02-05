import { Mechanism } from '../model/mechanisms/mechanism';
import { IDisposable } from '@babylonjs/core';
import { Subject, Subscription } from 'rxjs';
import { IModelDisposable } from '../model/interfaces/interfaces';
import { CommandInvoker } from '../core/undo/CommandInvoker';
import { AppInjector } from '../app.module';

/** abstract and generic class for all kinds of behaviors */
export abstract class Behavior implements IModelDisposable {
  protected readonly commandInvoker: CommandInvoker;

  readonly onDispose: Subject<void>;

  constructor(mechanism: Mechanism) {
    this.onDispose = new Subject<void>();
    this.commandInvoker = AppInjector.get(CommandInvoker);
  }

  dispose(): void {
    this.onDispose.next();
    this.onDispose.complete();
  }
}
