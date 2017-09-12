import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoriesNavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: TrajectoriesNavigationComponent;
  let fixture: ComponentFixture<TrajectoriesNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoriesNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoriesNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
