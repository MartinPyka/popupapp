import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Project, Path, Color, Point, Group, MouseEvent } from 'paper';

@Component({
  selector: 'projection-view',
  templateUrl: './projection-view.component.html',
  styleUrls: ['./projection-view.component.scss'],
})
export class ProjectionViewComponent implements AfterViewInit {
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

    const path3 = new Path({ strokeColor: 'black' });
    path3.add(new Point(10, 10));
    path3.add(new Point(20, 10));
    path3.add(new Point(30, 20));

    path3.segments[1].point.y = 40;

    */

    project.view.onMouseDown = this.onMouseDown;
  }

  onMouseDown(event: any) {
    console.log('You pressed the mouse!');
    console.log(event);
  }
}
