import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DatasetApiInterface,
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetStaConnectorProvider,
  HelgolandServicesConnector,
  HttpService,
  InternalIdHandler,
  Settings,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

import { CustomTrajectoryEntryComponent } from './custom-trajectory-entry.component';

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

describe('CustomTrajectoryEntryComponent', () => {
  let component: CustomTrajectoryEntryComponent;
  let fixture: ComponentFixture<CustomTrajectoryEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTrajectoryEntryComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        HttpClientTestingModule
      ],
      providers: [
        HelgolandServicesConnector,
        HttpService,
        { provide: SettingsService, useClass: TestSettingsService },
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
    fixture = TestBed.createComponent(CustomTrajectoryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
