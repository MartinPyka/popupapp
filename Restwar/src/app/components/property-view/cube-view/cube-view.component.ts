import { Component, Input, OnInit } from '@angular/core';
import { Vector3 } from '@babylonjs/core';
import { Object3D } from 'src/app/model/abstract/object3d';
import { Cube } from 'src/app/model/cube';

@Component({
  selector: 'cube-view',
  templateUrl: './cube-view.component.html',
  styleUrls: ['./cube-view.component.scss'],
})
export class CubeViewComponent implements OnInit {
  @Input() mesh?: Object3D;

  constructor() {}

  ngOnInit(): void {}

  changePositionX($event: number) {
    if (this.mesh == undefined) {
      return;
    }
    this.mesh.position.next(new Vector3($event, this.mesh.position.value.y, this.mesh.position.value.z));
  }
}
