import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[propertyDirective]',
})
export class PropertyDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
