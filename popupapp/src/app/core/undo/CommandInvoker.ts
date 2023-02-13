import { LimitedStack } from './LimitedStack';
import { ClosureCommands, Command } from './Command';
import { Injectable } from '@angular/core';

/**
 * The command invoker is responsible for executing every command and
 * providing undo and redo-functionality for everything
 */

let maxSize = 50;

@Injectable({
  providedIn: 'root',
})
export class CommandInvoker {
  protected undoStack: LimitedStack<Command>;
  protected redoStack: LimitedStack<Command>;

  public constructor() {
    this.undoStack = new LimitedStack<Command>(maxSize);
    this.redoStack = new LimitedStack<Command>(maxSize);
  }

  /**
   * Runs a given command
   * @param command the command that should be run
   * @returns if command could be executed successfully
   */
  public do(command: Command): boolean {
    this.clearRedoStack();
    let result = command.do();

    let droppedCommand = this.undoStack.push(command);
    if (droppedCommand) {
      this.clearCommandUndo(droppedCommand);
    }
    return result;
  }

  public undo(): boolean {
    if (this.undoStack.length() > 0) {
      let command = this.undoStack.pop();
      if (command) {
        let droppedCommand = this.redoStack.push(command);
        if (droppedCommand) {
          this.clearCommandRedo(droppedCommand);
        }
        return command.undo();
      }
      return false;
    } else {
      return false;
    }
  }

  public redo(): boolean {
    if (this.redoStack.length() > 0) {
      let command = this.redoStack.pop();
      if (command) {
        let droppedCommand = this.undoStack.push(command);
        if (droppedCommand) {
          this.clearCommandUndo(droppedCommand);
        }
        return command.redo();
      }
      return false;
    } else {
      return false;
    }
  }

  private clearRedoStack() {
    while (this.redoStack.length() > 0) {
      let command = this.redoStack.pop();
      if (command) {
        this.clearCommandRedo(command);
      }
    }
  }

  /**
   * Performs the destroy action for a command
   * that no longer remains on the redo stack
   * @param command
   */
  private clearCommandRedo(command: Command) {
    if (command && command.destroyFromRedo) {
      command.destroyFromRedo();
    }
  }

  /**
   * performs the destroy action for a command
   * that no longer remains on the undo stack
   * @param command
   */
  private clearCommandUndo(command: Command) {
    if (command && command.destroyFromUndo) {
      command.destroyFromUndo();
    }
  }

  public undoStackLength(): number {
    return this.undoStack.length();
  }
}
