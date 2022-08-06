import { takeUntil } from 'rxjs';
import { EditorBehavior } from 'src/app/behaviors/editor.behavior';
import { BehaviorPFoldControl } from 'src/app/behaviors/mechanism/Behavior.PFoldControl';
import { Channel } from 'src/app/core/channels';
import { MechanismFaceClick } from 'src/app/model/interfaces/interfaces';
import { Mechanism } from 'src/app/model/mechanisms/mechanism';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';

/**
 * Behavior for selecting and configuring a mechanism
 */
export class SelectMechanismBehavior extends EditorBehavior {
  private selectedMechanism: Mechanism | undefined = undefined;

  override get channelName(): string {
    return Channel.WORK_SELECT_MECHANISM;
  }

  override activate(): void {
    this.editorService.triggerSelection(Channel.SELECTION_MECHANISM);
    this.editorService
      .onFaceDown()
      .pipe(takeUntil(this.onDeactivate))
      .subscribe((mechanismFaceClick) => this.onMechanismFaceClick(mechanismFaceClick));
  }

  override deactivate(): void {
    this.detachFromSelectedMechanism();
  }

  /**
   * is called, whenever the user selects a face
   * @param mechanismFaceClick the structure, that defines the entire mechanism
   */
  onMechanismFaceClick(mechanismFaceClick: MechanismFaceClick) {
    if (this.selectedMechanism) {
      this.detachFromSelectedMechanism();
    }
    this.selectedMechanism = mechanismFaceClick.mechanism;
    this.attachToSelectedMechanism();
    this.editorService.setSelectedObject3D(this.selectedMechanism);
  }

  /**
   * removes the control behaviors from the previous mechanism,
   * depending, on which type of mechanism we had
   */
  detachFromSelectedMechanism(): void {
    if (this.selectedMechanism instanceof MechanismParallel) {
      this.selectedMechanism.removeBehavior(BehaviorPFoldControl);
    }
  }

  attachToSelectedMechanism(): void {
    if (this.selectedMechanism instanceof MechanismParallel) {
      this.selectedMechanism.addBehavior(BehaviorPFoldControl);
    }
  }
}
