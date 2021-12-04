import { Component, Input, OnInit } from '@angular/core';
import { Vector3 } from '@babylonjs/core';
import { Cube } from 'src/app/model/cube';

@Component({
  selector: 'cube-view',
  templateUrl: './cube-view.component.html',
  styleUrls: ['./cube-view.component.scss'],
})
export class CubeViewComponent implements OnInit {
  @Input() cube?: Cube;

  constructor() {}

  ngOnInit(): void {}

  changePositionX($event: number) {
    this.cube?.position.next(new Vector3($event, this.cube?.position.value.y, this.cube?.position.value.z));
  }
}
