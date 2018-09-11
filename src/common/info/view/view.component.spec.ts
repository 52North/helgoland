import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoViewComponent } from './view.component';

describe('ViewComponent', () => {
  let component: InfoViewComponent;
  let fixture: ComponentFixture<InfoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
