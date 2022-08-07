import { Injectable } from '@angular/core';
import { FoldParallelViewComponent } from '../components/property-view/fold-parallel-view/fold-parallel-view.component';
import { PropertyView } from '../components/property-view/property-view';

@Injectable()
export class PropertiesService {
  propertyComponents = {
    MechanismParallel: FoldParallelViewComponent,
  };
}
