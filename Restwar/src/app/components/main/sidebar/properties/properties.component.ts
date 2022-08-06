import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Object3D } from 'src/app/model/abstract/object3d';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit, OnChanges {
  @Input() selection: Object3D | null;

  className = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.className = changes['selection'].currentValue.constructor.name;
  }
}
