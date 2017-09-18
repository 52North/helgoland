import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermalinkToClipboardComponent } from './permalink-to-clipboard.component';

describe('PermalinkToClipboardComponent', () => {
  let component: PermalinkToClipboardComponent;
  let fixture: ComponentFixture<PermalinkToClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermalinkToClipboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermalinkToClipboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
