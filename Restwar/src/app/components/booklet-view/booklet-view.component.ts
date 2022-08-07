import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { changeNumberCommand, ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { MechanismActive } from 'src/app/model/mechanisms/mechanism.active';
import { PropertiesInterface } from '../main/sidebar/properties/properties.interface';

@Component({
  selector: 'booklet-view',
  templateUrl: './booklet-view.component.html',
  styleUrls: ['./booklet-view.component.scss'],
})
export class BookletViewComponent implements OnInit, PropertiesInterface {
  @Input() data: any;

  constructor(private commandInvoker: CommandInvoker) {}

  ngOnInit(): void {}

  changeValue($event: number, parameter: BehaviorSubject<number> | undefined) {
    if (!parameter) {
      return;
    }

    const closureCommand = changeNumberCommand($event, parameter);
    this.commandInvoker.do(closureCommand);
  }
}
