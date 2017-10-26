import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalSelectorComponent } from './local-selector.component';

describe('LocalSelectorComponent', () => {
  let component: LocalSelectorComponent;
  let fixture: ComponentFixture<LocalSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
