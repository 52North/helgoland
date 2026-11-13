import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { BasicAuthComponent } from './basic-auth.component';

describe('BasicAuthComponent', () => {
  let component: BasicAuthComponent;
  let fixture: ComponentFixture<BasicAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicAuthComponent ],
      imports: [
        FormsModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
