import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PointerEventTypes } from 'babylonjs';
import { Project, Path, Color, Point, Group, MouseEvent } from 'paper';
import { Projection } from 'src/app/projection/projection';

const CANVAS_ID = 'projection';
const ZOOM_DELTA = 0.2;

@Component({
  selector: 'projection-view',
  templateUrl: './projection-view.component.html',
  styleUrls: ['./projection-view.component.scss'],
})
export class ProjectionViewComponent implements AfterViewInit {
  point: paper.Point;
  path3: paper.Path;
  startPoint: paper.Point;
  lastCenter: paper.Point;
  project: paper.Project;

  constructor() {}

  ngAfterViewInit(): void {
    this.project = new Project('projection');
    this.project.view.zoom = 2.5;
    this.project.view.center = new Point(150, 80);

    this.project.view.onMouseDown = (event: any) => this.onMouseDown(event);
    this.project.view.onMouseDrag = (event: any) => this.onMouseDrag(event);
    this.project.view.onMouseUp = (event: any) => this.onMouseUp(event);
    document.getElementById(CANVAS_ID)?.addEventListener('wheel', (event: any) => this.onMouseWheel(event));
  }

  onMouseDown(event: any) {
    this.startPoint = event.point;
    this.lastCenter = this.project.view.center;
  }

  onMouseDrag(event: any) {
    const dragDelta = this.project.view.center.subtract(this.lastCenter);
    const delta = event.point.subtract(this.startPoint).subtract(dragDelta);
    this.project.view.center = this.lastCenter.subtract(delta);
  }

  onMouseUp(event: any) {}

  onMouseWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      this.project.view.zoom += ZOOM_DELTA;
    } else {
      this.project.view.zoom -= ZOOM_DELTA;
    }
  }
}
