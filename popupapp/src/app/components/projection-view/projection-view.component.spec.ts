import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionViewComponent } from './projection-view.component';

describe('ProjectionViewComponent', () => {
  let component: ProjectionViewComponent;
  let fixture: ComponentFixture<ProjectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
