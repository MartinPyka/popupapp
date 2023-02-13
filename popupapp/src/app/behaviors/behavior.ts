import { Subject } from 'rxjs';
import { IModelDisposable } from '../model/interfaces/interfaces';
import { CommandInvoker } from '../core/undo/CommandInvoker';
import { AppInjector } from '../app.module';

/** abstract and generic class for all kinds of behaviors */
export abstract class Behavior<T> implements IModelDisposable {
  protected readonly commandInvoker: CommandInvoker;

  readonly onDispose: Subject<void>;

  constructor(reference: T) {
    this.onDispose = new Subject<void>();
    this.commandInvoker = AppInjector.get(CommandInvoker);
  }

  dispose(): void {
    this.onDispose.next();
    this.onDispose.complete();
  }
}
