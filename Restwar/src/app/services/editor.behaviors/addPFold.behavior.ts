import { takeUntil } from 'rxjs';
import { EditorBehavior } from 'src/app/behaviors/editor.behavior';
import { Channel } from 'src/app/core/channels';
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

  onHingeSelected(mechanismHingeClick: MechanismHingeClick) {
    this.editorService.triggerSelection(Channel.SELECTION_NOTHING);
    this.editorService.addMechanism(new MechanismParallel(mechanismHingeClick.hinge));
  }
}
