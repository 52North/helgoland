import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermalinkButtonComponent } from './permalink-button.component';

describe('PermalinkButtonComponent', () => {
  let component: PermalinkButtonComponent;
  let fixture: ComponentFixture<PermalinkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermalinkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
