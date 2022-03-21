import { Component, OnInit } from '@angular/core';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';

@Component({
  selector: 'menu-icons',
  templateUrl: './menu-icons.component.html',
  styleUrls: ['./menu-icons.component.scss'],
})
export class MenuIconsComponent implements OnInit {
  constructor(private commandInvoker: CommandInvoker) {}

  ngOnInit(): void {}

  undo() {
    this.commandInvoker.undo();
  }

  redo() {
    this.commandInvoker.redo();
  }
}
