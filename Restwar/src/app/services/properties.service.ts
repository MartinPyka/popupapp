import { Injectable, Type } from '@angular/core';
import { BookletViewComponent } from '../components/booklet-view/booklet-view.component';
import { PropertiesInterface } from '../components/main/sidebar/properties/properties.interface';
import { FoldParallelViewComponent } from '../components/property-view/fold-parallel-view/fold-parallel-view.component';

/**
 * Service for mapping strings to property component names that
 * can be displayed in the side bar
 */
@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  propertyComponents: { [name: string]: Type<PropertiesInterface> } = {
    MechanismParallel: FoldParallelViewComponent,
    MechanismActive: BookletViewComponent,
  };
}
