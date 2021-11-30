import { Component, OnInit } from '@angular/core';
import { Mesh } from '@babylonjs/core';
import { BasicRenderService } from 'src/app/services/BasicRenderService';

@Component({
  selector: 'control-view',
  templateUrl: './control-view.component.html',
  styleUrls: ['./control-view.component.scss'],
})
export class ControlViewComponent implements OnInit {
  cube?: Mesh;

  constructor(protected readonly brs: BasicRenderService) {}

  ngOnInit(): void {}

  /**
   * adds a cube to the scene
   */
  addCube() {
    this.cube = this.brs.createCube();
  }
}
