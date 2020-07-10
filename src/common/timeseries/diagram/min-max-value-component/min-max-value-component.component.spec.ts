import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinMaxValueComponentComponent } from './min-max-value-component.component';

describe('MinMaxValueComponentComponent', () => {
  let component: MinMaxValueComponentComponent;
  let fixture: ComponentFixture<MinMaxValueComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinMaxValueComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinMaxValueComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
