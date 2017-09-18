import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermalinkInMailComponent } from './permalink-in-mail.component';

describe('PermalinkInMailComponent', () => {
  let component: PermalinkInMailComponent;
  let fixture: ComponentFixture<PermalinkInMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermalinkInMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkInMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
