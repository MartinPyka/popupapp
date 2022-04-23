import { AfterViewInit, Component } from '@angular/core';
import { EditorService } from './core/editor-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(protected readonly editorService: EditorService) {}

  ngAfterViewInit(): void {
    this.editorService.createEditorService();
  }
}
