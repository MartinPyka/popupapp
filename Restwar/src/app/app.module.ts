import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneViewComponent } from './components/scene-view/scene-view.component';
import { ControlViewComponent } from './components/control-view/control-view.component';
import { CubeViewComponent } from './components/property-view/cube-view/cube-view.component';
import { FormsModule } from '@angular/forms';
import { BookletViewComponent } from './components/booklet-view/booklet-view.component';

/**
 * app injector is used in the entire app, in order to
 * get singleton services
 */
export let AppInjector: Injector;

@NgModule({
  declarations: [AppComponent, SceneViewComponent, ControlViewComponent, CubeViewComponent, BookletViewComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
