import { PlaneRectangle } from '../planes/plane.rectangle';
import { HingeActive } from './hinge.active';

export class HingeBooklet extends HingeActive {
  readonly leftPlane: PlaneRectangle;
  readonly rightPlane: PlaneRectangle;
}
