import { takeUntil } from 'rxjs';
import { EditorBehavior } from 'src/app/behaviors/editor.behavior';
import { BehaviorOrientation } from 'src/app/behaviors/mechanism/Behavior.Orientation';
import { Channel } from 'src/app/core/channels';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { MechanismHingeClick } from 'src/app/model/interfaces/interfaces';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { EditorService } from '../editor.service';

/**
 * Behavior for adding a parallel fold to the construction
 */
export class AddPFoldBehavior extends EditorBehavior {
  constructor(editorService: EditorService) {
    super(editorService);
    this.editorService.registerWorkMode(Channel.WORK_PFold, (value) => this.trigger(value));
  }

  /**
   * this function gets triggered, when ever someone sends something
   * on the behavior channel
   * @param value
   */
  trigger(value: boolean) {
    if (value) {
      this.editorService.triggerSelection(Channel.SELECTION_HINGE);
      this.editorService
        .onHingeDown()
        .pipe(takeUntil(this.onDeactivate))
        .subscribe((mechanismHingeClick) => this.onHingeSelected(mechanismHingeClick));
    } else {
      this.onDeactivate.next();
      this.editorService.triggerSelection(Channel.SELECTION_NOTHING);
    }
  }

  /**
   * gets called, when the user clicks on a hinge
   * @param mechanismHingeClick
   */
  onHingeSelected(mechanismHingeClick: MechanismHingeClick) {
    this.editorService.triggerSelection(Channel.SELECTION_NOTHING);
    const doAction = (): CommandParts => {
      const mec = new MechanismParallel(mechanismHingeClick.hinge);
      this.editorService.addMechanism(mec);

      const undo = (): boolean => {
        mec.visible(false);
        this.editorService.removeMechanism(mec);
        return true;
      };

      const redo = (): boolean => {
        mec.visible(true);
        this.editorService.addMechanism(mec);
        return true;
      };

      const destroyFromRedo = (): boolean => {
        mec.dispose();
        return true;
      };

      return new CommandParts(undo, redo, undefined, destroyFromRedo);
    };
    this.commandInvoker.do(new ClosureCommands(doAction));
  }
}
