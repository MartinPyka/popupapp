import { AfterViewInit, Component } from '@angular/core';
import { AddPFoldBehavior } from './services/editor.behaviors/addPFold.behavior';
import { SelectMechanismBehavior } from './services/editor.behaviors/selectMechanism.behavior';
import { EditorService } from './services/editor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(protected readonly editorService: EditorService) {}

  ngAfterViewInit(): void {
    this.editorService.createEditorService();
    this.editorService.addBehavior(AddPFoldBehavior);
    this.editorService.addBehavior(SelectMechanismBehavior);
  }
}
