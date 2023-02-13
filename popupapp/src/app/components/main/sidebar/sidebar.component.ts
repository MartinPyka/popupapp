import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Object3D } from 'src/app/model/abstract/object3d';
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  objectBehavior: Observable<Object3D>;

  constructor(public editorService: EditorService) {
    this.objectBehavior = editorService.selectedObject3D;
  }

  ngOnInit(): void {}
}
