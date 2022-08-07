import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { changeNumberCommand } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { MechanismParallel } from 'src/app/model/mechanisms/mechanism.parallel';
import { PropertiesInterface } from '../../main/sidebar/properties/properties.interface';

@Component({
  selector: 'fold-parallel-view',
  templateUrl: './fold-parallel-view.component.html',
  styleUrls: ['./fold-parallel-view.component.scss'],
})
export class FoldParallelViewComponent implements OnInit, PropertiesInterface {
  @Input() mecParallel: MechanismParallel;

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
