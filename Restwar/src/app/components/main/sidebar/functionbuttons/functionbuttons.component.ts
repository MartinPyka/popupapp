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

  constructor(private editorService: EditorService) {}

  ngOnInit(): void {}

  addMecActive() {
    this.mecActive = new MechanismActive(null);
    this.mecActive.leftAngle.next(-45);
    this.mecActive.rightAngle.next(-60);
    this.mecActive.addBehavior(BehaviorBookletControl);
  }

  addPFold() {
    //this.mecParallel = new MechanismParallel(this.mecActive.centerHinge);
    //this.mecParallel.addBehavior(BehaviorOrientation);
    this.editorService.setWorkMode(Channel.WORK_PFold);
  }

  addVFold() {
    this.editorService.setWorkMode(Channel.WORK_NOTHING);
  }

  activate() {
    this.editorService.triggerSelection(Channel.SELECTION_HINGE);
  }

  deactivate() {
    this.editorService.triggerSelection(Channel.SELECTION_NOTHING);
  }
}
