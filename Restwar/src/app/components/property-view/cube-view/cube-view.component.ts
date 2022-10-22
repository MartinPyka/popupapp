import { Component, Input, OnInit } from '@angular/core';
import { Vector3 } from 'babylonjs';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Volume3D } from 'src/app/model/abstract/volume3d';
import { PlaneRectangle } from 'src/app/model/planes/plane.rectangle';

@Component({
  selector: 'cube-view',
  templateUrl: './cube-view.component.html',
  styleUrls: ['./cube-view.component.scss'],
})
export class CubeViewComponent implements OnInit {
  @Input() mesh?: Volume3D;

  @Input() plane?: PlaneRectangle;

  constructor(private commandInvoker: CommandInvoker) {}

  ngOnInit(): void {}

  changePositionX($event: number) {
    if (this.mesh == undefined) {
      return;
    }

    /**
     * create a doAction for a Closure Command that brings its
     * undo and redo function with it
     * @returns
     */
    let doAction = (): CommandParts => {
      let oldValue = this.mesh?.position.value ?? new Vector3(0, 0, 0);
      let newValue = new Vector3($event, this.mesh?.position.value.y, this.mesh?.position.value.z);

      this.mesh?.position.next(newValue);

      let undo = (): boolean => {
        this.mesh?.position.next(oldValue);
        return true;
      };
      let redo = (): boolean => {
        this.mesh?.position.next(newValue);
        return true;
      };

      return new CommandParts(undo, redo, undefined, undefined);
    };

    this.commandInvoker.do(new ClosureCommands(doAction));
  }

  changeHeight($event: number) {
    if (this.plane == undefined) {
      return;
    }

    let doAction = (): CommandParts => {
      let oldValue = this.plane?.height.value ?? 1;
      let newValue = $event;

      this.plane?.height.next(newValue);

      let undo = (): boolean => {
        this.plane?.height.next(oldValue);
        return true;
      };

      let redo = (): boolean => {
        this.plane?.height.next(newValue);
        return true;
      };

      return new CommandParts(undo, redo, undefined, undefined);
    };

    this.commandInvoker.do(new ClosureCommands(doAction));
  }

  changeWidth($event: number) {
    if (this.plane == undefined) {
      return;
    }

    let doAction = (): CommandParts => {
      let oldValue = this.plane?.width.value ?? 1;
      let newValue = $event;

      this.plane?.width.next(newValue);

      let undo = (): boolean => {
        this.plane?.width.next(oldValue);
        return true;
      };

      let redo = (): boolean => {
        this.plane?.width.next(newValue);
        return true;
      };

      return new CommandParts(undo, redo, undefined, undefined);
    };

    this.commandInvoker.do(new ClosureCommands(doAction));
  }
}
