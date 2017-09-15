import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombiViewComponent } from './combi-view.component';

describe('CombiViewComponent', () => {
  let component: CombiViewComponent;
  let fixture: ComponentFixture<CombiViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombiViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
