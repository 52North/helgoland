import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService, LocalStorage } from '@helgoland/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfilesCombiService } from './../combi-view/combi-view.service';
import { ProfilesService } from './../services/profiles.service';
import { ProfilesDiagramPermalink } from './diagram-permalink.service';
import { ProfilesDiagramComponent } from './diagram.component';

describe('ProfilesDiagramComponent', () => {
  let component: ProfilesDiagramComponent;
  let fixture: ComponentFixture<ProfilesDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesDiagramComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule,
        NgbModalModule
      ],
      providers: [
        ProfilesService,
        ProfilesCombiService,
        ProfilesDiagramPermalink,
        LocalStorage,
        ColorService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
