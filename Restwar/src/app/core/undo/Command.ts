import { BehaviorSubject } from 'rxjs';
import { Behavior } from 'src/app/behaviors/behavior';
import { BoolAction } from './delegates';

export interface Command {
  /**
   * The do function, this is the main function
   */
  do: BoolAction;

  /**
   * Undo the command and returns true, if it was able to successfully do it
   */
  undo: BoolAction;

  /**
   * Redo function, which defaults to Do(), but this might be overriden
   */
  redo: BoolAction;

  /**
   * When Commands in the Undo-Stack are not needed anymore, this
   * routine is called before they are deleted. This method can be
   * used for instance to finally destroy invisible GameObjects.
   */
  destroyFromUndo: BoolAction;

  /**
   * When Commands in the Redo-Stack are not needed anymore, this
   * routine is called before they are deleted. This method can be
   * used for instance to finally destroy invisible GameObjects.
   */
  destroyFromRedo: BoolAction;
}

export class CommandParts {
  public undo: BoolAction;

  public redo: BoolAction;

  public destroyFromUndo: BoolAction | undefined;

  public destroyFromRedo: BoolAction | undefined;

  public constructor(
    undo: BoolAction,
    redo: BoolAction,
    destroyFromUndo: BoolAction | undefined,
    destroyFromRedo: BoolAction | undefined
  ) {
    this.undo = undo;
    this.redo = redo;
    this.destroyFromUndo = destroyFromUndo;
    this.destroyFromRedo = destroyFromRedo;
  }
}

export interface Func<T> {
  (): T;
}

/**
 * Command that runs an action and returns a struct of actions in order to undo,
 * redo and destroy it.
 */
export class ClosureCommands implements Command {
  /** The DoAction is a function that performs the do action
   * and returns a CommandParts-instance with its corresponding
   * Undo, Redo etc. functions.
   */
  private doAction: Func<CommandParts>;

  private CommandParts: CommandParts;

  public constructor(doAction: Func<CommandParts>) {
    this.doAction = doAction;
  }

  public do(): boolean {
    try {
      this.CommandParts = this.doAction();
      return true;
    } catch {
      return false;
    }
  }

  public undo(): boolean {
    try {
      return this.CommandParts.undo();
    } catch {
      return false;
    }
  }

  public redo(): boolean {
    try {
      if (this.CommandParts.redo) {
        return this.CommandParts.redo();
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  public destroyFromRedo(): boolean {
    try {
      if (this.CommandParts.destroyFromRedo) {
        return this.CommandParts.destroyFromRedo();
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  public destroyFromUndo(): boolean {
    try {
      if (this.CommandParts.destroyFromUndo) {
        return this.CommandParts.destroyFromUndo();
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}

/**
 * Creates a closure command for changing a numeric value
 * @param value value that should be used
 * @param parameter BehaviorSubject<number> on which the new value should be applied
 * @returns ClosureCommand for applying this value in an undo/redo-context (e.g. for CommandInvoker)
 */
export function changeNumberCommand(value: number, parameter: BehaviorSubject<number>): ClosureCommands {
  let doAction = (): CommandParts => {
    let oldValue = parameter.getValue() ?? 1;
    let newValue = value;
    parameter.next(newValue);

    let undo = (): boolean => {
      parameter.next(oldValue);
      return true;
    };

    let redo = (): boolean => {
      parameter.next(newValue);
      return true;
    };

    return new CommandParts(undo, redo, undefined, undefined);
  };

  return new ClosureCommands(doAction);
}
