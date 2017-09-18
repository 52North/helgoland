import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermalinkNewWindowComponent } from './permalink-new-window.component';

describe('PermalinkNewWindowComponent', () => {
  let component: PermalinkNewWindowComponent;
  let fixture: ComponentFixture<PermalinkNewWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermalinkNewWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkNewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
