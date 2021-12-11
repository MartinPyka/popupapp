import { Component, OnInit } from '@angular/core';
import { Vector3 } from '@babylonjs/core';
import { SphereEmitterGridComponent } from '@babylonjs/inspector/components/actionTabs/tabs/propertyGrids/particleSystems/sphereEmitterGridComponent';
import { CommandInvoker } from 'src/app/core/undo/CommandInvoker';
import { Cube } from 'src/app/model/cube';
import { Sphere } from 'src/app/model/sphere';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

@Component({
  selector: 'control-view',
  templateUrl: './control-view.component.html',
  styleUrls: ['./control-view.component.scss'],
})
export class ControlViewComponent implements OnInit {
  cube?: Cube;
  sphere?: Sphere;

  constructor(protected readonly brs: BasicRenderService, private commandInvoker: CommandInvoker) {}

  ngOnInit(): void {}

  /**
   * adds a cube to the scene
   */
  addCube() {
    if (this.sphere != undefined) {
      this.sphere.dispose();
    }
    this.cube = new Cube(new Vector3(3, 2, 1));
  }

  /**
   * adds a cube to the scene
   */
  addSphere() {
    this.sphere = new Sphere(new Vector3(1, 2, 3));
  }

  undo() {
    this.commandInvoker.undo();
  }

  redo() {
    this.commandInvoker.redo();
  }
}
