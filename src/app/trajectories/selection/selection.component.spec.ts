import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoriesSelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let component: TrajectoriesSelectionComponent;
  let fixture: ComponentFixture<TrajectoriesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoriesSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoriesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
