import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldParallelViewComponent } from './fold-parallel-view.component';

describe('FoldParallelViewComponent', () => {
  let component: FoldParallelViewComponent;
  let fixture: ComponentFixture<FoldParallelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoldParallelViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldParallelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
