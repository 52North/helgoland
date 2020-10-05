import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFavoriteTogglerComponent } from './custom-favorite-toggler.component';

describe('CustomFavoriteTogglerComponent', () => {
  let component: CustomFavoriteTogglerComponent;
  let fixture: ComponentFixture<CustomFavoriteTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFavoriteTogglerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFavoriteTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
