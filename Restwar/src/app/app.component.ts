import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Restwar';

  test = [23, 2, 2];

  foo() {
    this.title = 'dss';
  }
}
