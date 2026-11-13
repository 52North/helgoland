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
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { TrajectoriesService } from './../services/trajectories.service';
import { TrajectoriesViewPermalink } from './view-permalink';
import { TrajectoriesViewComponent } from './view.component';

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

describe('ViewComponent', () => {
  let component: TrajectoriesViewComponent;
  let fixture: ComponentFixture<TrajectoriesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoriesViewComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule,
        NgbModalModule,
        HttpClientTestingModule
      ],
      providers: [
        TrajectoriesService,
        TrajectoriesViewPermalink,
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
    fixture = TestBed.createComponent(TrajectoriesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
