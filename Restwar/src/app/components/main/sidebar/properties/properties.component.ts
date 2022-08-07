import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FoldParallelViewComponent } from 'src/app/components/property-view/fold-parallel-view/fold-parallel-view.component';
import { PropertyView } from 'src/app/components/property-view/property-view';
import { PropertyDirective } from 'src/app/directives/property-directive.directive';
import { Object3D } from 'src/app/model/abstract/object3d';
import { PropertiesService } from 'src/app/services/properties.service';
import { PropertiesInterface } from './properties.interface';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit, OnChanges {
  @Input() selection: Object3D | null;
  @ViewChild(PropertyDirective, { static: true }) propertyDirective!: PropertyDirective;

  className = '';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.className = changes['selection'].currentValue.constructor.name;
    const viewContainerRef = this.propertyDirective.viewContainerRef;

    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<PropertiesInterface>(
      new PropertyView(FoldParallelViewComponent).component
    );
    componentRef.instance.mecParallel = changes['selection'].currentValue;
  }
}
