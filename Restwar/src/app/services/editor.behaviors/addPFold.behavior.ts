import { takeUntil } from 'rxjs';
import { EditorBehavior } from 'src/app/behaviors/editor.behavior';
import { Channel } from 'src/app/core/channels';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { MechanismHingeClick } from 'src/app/model/interfaces/interfaces';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';

/**
 * Behavior for adding a parallel fold to the construction
 */
export class AddPFoldBehavior extends EditorBehavior {
  override channelName = Channel.WORK_PFold;

  /**
   * this function gets triggered, when ever someone activates
   *
   * @param value
   */
  override activate(): void {
    this.editorService.triggerSelection(Channel.SELECTION_HINGE);
    this.editorService
      .onHingeDown()
      .pipe(takeUntil(this.onDeactivate))
      .subscribe((mechanismHingeClick) => this.onHingeSelected(mechanismHingeClick));
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
