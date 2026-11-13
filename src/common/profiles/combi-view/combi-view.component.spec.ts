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
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfilesCombiService } from './combi-view.service';
import { ProfilesCombiViewPermalink } from './combi-view-permalink.service';
import { ProfilesCombiViewComponent } from './combi-view.component';

@Injectable()
class TestSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({
      // Settings.languages is typed as a single-element tuple; one of the
      // languages configured in assets/config/settings.json is provided.
      languages: [
        { label: 'Deutsch', code: 'de' }
      ]
    });
  }
}

describe('ProfilesCombiViewComponent', () => {
  let component: ProfilesCombiViewComponent;
  let fixture: ComponentFixture<ProfilesCombiViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesCombiViewComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        ProfilesCombiService,
        ProfilesCombiViewPermalink,
        { provide: SettingsService, useClass: TestSettingsService },
        LocalStorage,
        ColorService,
        InternalIdHandler,
        HelgolandServicesConnector,
        HttpService,
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
    fixture = TestBed.createComponent(ProfilesCombiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
