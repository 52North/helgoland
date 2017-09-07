import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSelectionComponent } from './provider-selection.component';

describe('ProviderSelectionComponent', () => {
  let component: ProviderSelectionComponent;
  let fixture: ComponentFixture<ProviderSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
