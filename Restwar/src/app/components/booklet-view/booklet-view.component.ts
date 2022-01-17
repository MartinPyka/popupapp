import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';

@Component({
  selector: 'booklet-view',
  templateUrl: './booklet-view.component.html',
  styleUrls: ['./booklet-view.component.scss'],
})
export class BookletViewComponent implements OnInit {
  @Input() mecActive?: MechanismActive;

  constructor(private commandInvoker: CommandInvoker) {}

  ngOnInit(): void {}

  changeAngle($event: number, parameter: BehaviorSubject<number> | undefined) {
    if (!parameter) {
      return;
    }

    let doAction = (): CommandParts => {
      let oldValue = parameter.getValue() ?? 1;
      let newValue = $event;
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

    this.commandInvoker.do(new ClosureCommands(doAction));
  }
}
