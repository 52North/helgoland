import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ColorService,
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HelgolandServicesConnector,
  HttpService,
  InternalIdHandler,
  LocalStorage,
  Settings,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { NgbAccordionModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfilesCombiService } from './../combi-view/combi-view.service';
import { ProfilesService } from './../services/profiles.service';
import { ProfilesSelectionCache } from './selection.service';
import { ProfilesSelectionPermalink } from './selection-permalink.service';
import { ProfilesSelectionComponent } from './selection.component';

@Injectable()
class TestSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({
      // Settings.languages is typed as a single-element tuple; one of the
      // languages configured in assets/config/settings.json is provided.
      languages: [
        { label: 'Deutsch', code: 'de' }
      ],
      datasetApis: [
        { name: '52north - Sensorwebtestbed', url: 'https://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/' }
      ],
      providerBlackList: []
    });
  }
}

describe('ProfilesSelectionComponent', () => {
  let component: ProfilesSelectionComponent;
  let fixture: ComponentFixture<ProfilesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesSelectionComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule,
        NgbModalModule,
        NgbAccordionModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: SettingsService, useClass: TestSettingsService },
        ProfilesSelectionCache,
        ProfilesService,
        ProfilesCombiService,
        ProfilesSelectionPermalink,
        LocalStorage,
        ColorService,
        HelgolandServicesConnector,
        HttpService,
        InternalIdHandler,
        { provide: DatasetApiInterface, useClass: SplittedDataDatasetApiInterface },
        DatasetApiV1ConnectorProvider,
        DatasetApiV2ConnectorProvider,
        DatasetApiV3ConnectorProvider,
        DatasetStaConnectorProvider
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
