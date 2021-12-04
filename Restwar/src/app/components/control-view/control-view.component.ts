import { Component, OnInit } from '@angular/core';
import { Vector3 } from '@babylonjs/core';
import { Cube } from 'src/app/model/cube';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

@Component({
  selector: 'control-view',
  templateUrl: './control-view.component.html',
  styleUrls: ['./control-view.component.scss'],
})
export class ControlViewComponent implements OnInit {
  cube?: Cube;

  constructor(protected readonly brs: BasicRenderService) {}

  ngOnInit(): void {}

  /**
   * adds a cube to the scene
   */
  addCube() {
    this.cube = new Cube(new Vector3(3, 2, 1), this.brs);
  }
}
