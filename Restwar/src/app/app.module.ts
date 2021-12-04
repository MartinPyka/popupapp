import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneViewComponent } from './components/scene-view/scene-view.component';
import { ControlViewComponent } from './components/control-view/control-view.component';
import { CubeViewComponent } from './components/property-view/cube-view/cube-view.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SceneViewComponent, ControlViewComponent, CubeViewComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
