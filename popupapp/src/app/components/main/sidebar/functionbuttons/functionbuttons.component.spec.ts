import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionbuttonsComponent } from './functionbuttons.component';

describe('FunctionbuttonsComponent', () => {
  let component: FunctionbuttonsComponent;
  let fixture: ComponentFixture<FunctionbuttonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionbuttonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionbuttonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
