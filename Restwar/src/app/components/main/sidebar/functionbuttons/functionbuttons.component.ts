import { Component, OnInit } from '@angular/core';
import { BehaviorBookletControl } from 'src/app/behaviors/mechanism/Behavior.BookletControl';
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

  constructor() {}

  ngOnInit(): void {}

  addMecActive() {
    this.mecActive = new MechanismActive(null);
    this.mecActive.leftAngle.next(-45);
    this.mecActive.rightAngle.next(-60);
    this.mecActive.addBehavior(BehaviorBookletControl);
  }

  addMecParallel() {
    this.mecParallel = new MechanismParallel(this.mecActive.centerHinge);
    //this.mecParallel.addBehavior(BehaviorOrientation);
  }
}
