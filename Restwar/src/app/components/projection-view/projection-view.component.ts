import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PointerEventTypes } from 'babylonjs';
import { Project, Path, Color, Point, Group, MouseEvent } from 'paper';
import { Projection } from 'src/app/projection/projection';

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
    /*
    const group = new Group();
    group.position = new Point(0, 100);
    group.applyMatrix = false;
    const path = new Path.Circle(new Point(80, 50), 30);
    path.strokeColor = new Color(1, 0, 0);
    const path2 = new Path.Circle({
      center: [80, 80],
      radius: 30,
      strokeColor: 'black',
    });
    path2.fillColor = new Color(0.8, 0.8, 0.8);
    path2.visible = true;
    path2.onMouseDown = (event: MouseEvent) => {
      console.log('circle pressed');
      console.log(event);
    };
    group.addChild(path);
    group.addChild(path2);

    this.path3 = new Path({ strokeColor: 'black' });
    this.path3.add(new Point(10, 10));

    let point = new Point(20, 40);

    this.path3.add(point);

    point.x = 80;
    point.y = 10;

    this.point = new Point(30, 20);
    this.path3.add(this.point);
    this.path3.segments[1].point = point;
    */
    this.project.view.onMouseDown = (event: any) => this.onMouseDown(event);
    this.project.view.onMouseDrag = (event: any) => this.onMouseDrag(event);
    this.project.view.onMouseUp = (event: any) => this.onMouseUp(event);
  }

  onMouseDown(event: any) {
    this.startPoint = event.point;
    this.lastCenter = this.project.view.center;
    console.log('You pressed the mouse!');
    console.log(event);
  }

  onMouseDrag(event: any) {
    const dragDelta = this.project.view.center.subtract(this.lastCenter);
    const delta = event.point.subtract(this.startPoint).subtract(dragDelta);
    console.log('You dragged the mouse!');
    console.log(event);
    console.log('Delta: ', delta);
    this.project.view.center = this.lastCenter.subtract(delta);
  }

  onMouseUp(event: any) {
    console.log('You released the mouse!');
    console.log(event);
  }
}
