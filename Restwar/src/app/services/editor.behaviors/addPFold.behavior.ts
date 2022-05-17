import { IDisposable } from '@babylonjs/core';
import { Behavior } from 'src/app/behaviors/behavior';
import { Channel } from 'src/app/core/channels';
import { EditorService } from '../editor.service';

/**
 * Behavior for adding a parallel fold to the construction
 */
export class AddPFoldBehavior extends Behavior<EditorService> implements IDisposable {
  constructor(private editorService: EditorService) {
    super(editorService);
    editorService.onWorkMode.on(Channel.WORK_PFold, this.trigger);
  }

  /**
   * this function gets triggered, when ever someone sends something
   * on the behavior channel
   * @param value
   */
  trigger(value: boolean) {
    if (value) {
      this.editorService.triggerSelection(Channel.SELECTION_HINGE);
    } else {
    }
  }
}
