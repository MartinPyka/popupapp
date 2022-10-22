import { Component, OnInit } from '@angular/core';
import { BehaviorBookletControl } from 'src/app/behaviors/mechanism/Behavior.BookletControl';
import { Channel } from 'src/app/core/channels';
import { EditorService } from 'src/app/services/editor.service';
import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';

@Component({
  selector: 'functionbuttons',
  templateUrl: './functionbuttons.component.html',
  styleUrls: ['./functionbuttons.component.scss'],
})
export class FunctionbuttonsComponent implements OnInit {
  mecActive: MechanismActive;
  mecParallel: MechanismParallel;
  Channel = Channel;

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {}

  addMecActive() {
    this.mecActive = new MechanismActive(null);
    this.mecActive.leftAngle.next(-45);
    this.mecActive.rightAngle.next(-60);
    this.mecActive.addBehavior(BehaviorBookletControl);
  }

  addVFold() {
    this.editorService.setWorkMode(Channel.WORK_NOTHING);
  }

  /**
   * generic function in order to activate a work mode
   * triggered
   * @param workMode
   */
  functionButton(workMode: string) {
    this.editorService.setWorkMode(workMode);
  }

  activate() {
    this.editorService.triggerSelection(Channel.SELECTION_HINGE);
  }

  deactivate() {
    this.editorService.triggerSelection(Channel.SELECTION_NOTHING);
  }
}
