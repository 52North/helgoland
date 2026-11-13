import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DatasetApiInterface,
  DatasetApiMapping,
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
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

import { ListSelectorService } from '@helgoland/selector';
import { ProviderParameterSeletorComponent } from './provider-parameter-selector.component';

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

describe('ProviderParameterSeletorComponent', () => {
  let component: ProviderParameterSeletorComponent;
  let fixture: ComponentFixture<ProviderParameterSeletorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderParameterSeletorComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        HttpClientTestingModule,
        NgbAccordionModule
      ],
      providers: [
        ListSelectorService,
        DatasetApiMapping,
        HelgolandServicesConnector,
        HttpService,
        InternalIdHandler,
        { provide: SettingsService, useClass: TestSettingsService },
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
    fixture = TestBed.createComponent(ProviderParameterSeletorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
