import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderParameterSeletorComponent } from './provider-parameter-selector.component';

describe('ProviderParameterSeletorComponent', () => {
  let component: ProviderParameterSeletorComponent;
  let fixture: ComponentFixture<ProviderParameterSeletorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderParameterSeletorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderParameterSeletorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
