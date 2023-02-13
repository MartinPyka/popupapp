import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CubeViewComponent } from './cube-view.component';

describe('CubeViewComponent', () => {
  let component: CubeViewComponent;
  let fixture: ComponentFixture<CubeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CubeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CubeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
