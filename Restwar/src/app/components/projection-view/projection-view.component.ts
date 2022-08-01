import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PointerEventTypes } from 'babylonjs';
import { Project, Path, Color, Point, Group, MouseEvent } from 'paper';

@Component({
  selector: 'projection-view',
  templateUrl: './projection-view.component.html',
  styleUrls: ['./projection-view.component.scss'],
})
export class ProjectionViewComponent implements AfterViewInit {
  point: paper.Point;
  path3: paper.Path;
  constructor() {}

  ngAfterViewInit(): void {
    const project = new Project('projection');
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

    project.view.onMouseDown = (event: any) => this.onMouseDown(event);
    */
  }

  onMouseDown(event: any) {
    console.log(this.point);
    if (this.point) {
      console.log('if clause triggered');
      //this.point.x = 50;
      this.path3.segments[2].point.x = 50;
    }
    console.log('You pressed the mouse!');
    console.log(event);
  }
}
