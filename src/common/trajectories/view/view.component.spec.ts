import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoriesViewComponent } from './view.component';

describe('ViewComponent', () => {
  let component: TrajectoriesViewComponent;
  let fixture: ComponentFixture<TrajectoriesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoriesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoriesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
