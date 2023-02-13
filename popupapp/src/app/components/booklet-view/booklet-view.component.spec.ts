import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookletViewComponent } from './booklet-view.component';

describe('BookletViewComponent', () => {
  let component: BookletViewComponent;
  let fixture: ComponentFixture<BookletViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookletViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookletViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
