import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService, LocalStorage } from '@helgoland/core';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

import { TrajectoriesService } from './../services/trajectories.service';
import { TrajectoriesSelectionComponent } from './selection.component';

describe('SelectionComponent', () => {
  let component: TrajectoriesSelectionComponent;
  let fixture: ComponentFixture<TrajectoriesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoriesSelectionComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule,
        NgbTabsetModule
      ],
      providers: [TrajectoriesService, LocalStorage, ColorService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoriesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
