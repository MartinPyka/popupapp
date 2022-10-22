import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive for replacing the ng-template in
 * properties by a component that shows the property of
 * the selected mechanism / side
 */
@Directive({
  selector: '[propertyDirective]',
})
export class PropertyDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
