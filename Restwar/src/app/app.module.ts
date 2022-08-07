import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneViewComponent } from './components/scene-view/scene-view.component';
import { ControlViewComponent } from './components/control-view/control-view.component';
import { CubeViewComponent } from './components/property-view/cube-view/cube-view.component';
import { FormsModule } from '@angular/forms';
import { BookletViewComponent } from './components/booklet-view/booklet-view.component';
import { ProjectionViewComponent } from './components/projection-view/projection-view.component';
import { FoldParallelViewComponent } from './components/property-view/fold-parallel-view/fold-parallel-view.component';
import { MenuComponent } from './components/main/menu/menu.component';
import { MenuIconsComponent } from './components/main/menu-icons/menu-icons.component';
import { MenuBarComponent } from './components/main/menu-bar/menu-bar.component';
import { SidebarComponent } from './components/main/sidebar/sidebar.component';
import { FunctionbuttonsComponent } from './components/main/sidebar/functionbuttons/functionbuttons.component';
import { TreeviewComponent } from './components/main/sidebar/treeview/treeview.component';
import { PropertiesComponent } from './components/main/sidebar/properties/properties.component';
import { PropertyDirective } from './directives/property-directive.directive';

/**
 * app injector is used in the entire app, in order to
 * get singleton services
 */
export let AppInjector: Injector;

@NgModule({
  declarations: [
    AppComponent,
    SceneViewComponent,
    ControlViewComponent,
    CubeViewComponent,
    BookletViewComponent,
    ProjectionViewComponent,
    FoldParallelViewComponent,
    MenuComponent,
    MenuIconsComponent,
    MenuBarComponent,
    SidebarComponent,
    FunctionbuttonsComponent,
    TreeviewComponent,
    PropertiesComponent,
    PropertyDirective,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
