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
  NotifierService,
  Settings,
  SettingsService,
  SplittedDataDatasetApiInterface,
  Time,
} from '@helgoland/core';
import { ReferenceValueColorCache } from '@helgoland/depiction';
import { FavoriteService } from '@helgoland/favorite';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

import { CustomFavoriteTogglerComponent } from '../../../components/custom-favorite-toggler/custom-favorite-toggler.component';
import { LegendEntryComponent } from './legend-entry.component';

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

describe('LegendEntryComponent', () => {
  let component: LegendEntryComponent;
  let fixture: ComponentFixture<LegendEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // CustomFavoriteTogglerComponent must be declared: the legend template
      // binds [dataset] to <custom-favorite-toggler>, and on a plain element
      // that binding hits the read-only DOM HTMLElement.dataset property.
      declarations: [ LegendEntryComponent, CustomFavoriteTogglerComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        HttpClientTestingModule
      ],
      providers: [
        HelgolandServicesConnector,
        HttpService,
        { provide: SettingsService, useClass: TestSettingsService },
        FavoriteService,
        NotifierService,
        Time,
        LocalStorage,
        InternalIdHandler,
        ColorService,
        ReferenceValueColorCache,
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
    fixture = TestBed.createComponent(LegendEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
