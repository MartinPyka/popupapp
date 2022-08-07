import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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

  constructor(private propertiesService: PropertiesService) {}

  ngOnInit(): void {}

  /**
   * updates the properties view when the user makes a selection of a
   * UI element that has properties
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.className = changes['selection'].currentValue.constructor.name;

    // get the container reference and clear it
    const viewContainerRef = this.propertyDirective.viewContainerRef;
    viewContainerRef.clear();

    // look up the corresponding component view and create it
    let component = this.propertiesService.propertyComponents[this.className];
    const componentRef = viewContainerRef.createComponent<PropertiesInterface>(component);
    componentRef.instance.data = changes['selection'].currentValue;
  }
}
