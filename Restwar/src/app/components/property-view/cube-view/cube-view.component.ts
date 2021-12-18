import { unsupported } from '@angular/compiler/src/render3/view/util';
import { Component, Input, OnInit } from '@angular/core';
import { Vector3 } from '@babylonjs/core';
import { ClosureCommands, CommandParts } from 'src/app/core/undo/Command';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Volume3D } from 'src/app/model/abstract/volume3d';
import { FaceRectangle } from 'src/app/model/faces/face.rectangle';

@Component({
  selector: 'cube-view',
  templateUrl: './cube-view.component.html',
  styleUrls: ['./cube-view.component.scss'],
})
export class CubeViewComponent implements OnInit {
  @Input() mesh?: Volume3D;

  @Input() face?: FaceRectangle;

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
    if (this.face == undefined) {
      return;
    }

    let doAction = (): CommandParts => {
      let oldValue = this.face?.height.value ?? 1;
      let newValue = $event;

      this.face?.height.next(newValue);

      let undo = (): boolean => {
        this.face?.height.next(oldValue);
        return true;
      };

      let redo = (): boolean => {
        this.face?.height.next(newValue);
        return true;
      };

      return new CommandParts(undo, redo, undefined, undefined);
    };

    this.commandInvoker.do(new ClosureCommands(doAction));
  }
}
