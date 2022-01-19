import { Component, OnInit } from '@angular/core';
import { Project, Path, Color, Point, tool, ToolEvent } from 'paper';

@Component({
  selector: 'projection-view',
  templateUrl: './projection-view.component.html',
  styleUrls: ['./projection-view.component.scss'],
})
export class ProjectionViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const project = new Project('projection');
    const path = new Path.Circle(new Point(80, 50), 30);
    path.strokeColor = new Color(1, 0, 0);
    const path2 = new Path.Circle({
      center: [80, 80],
      radius: 30,
      strokeColor: 'black',
    });
  }
}
