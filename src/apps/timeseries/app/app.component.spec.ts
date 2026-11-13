import { TestBed, async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Settings, SettingsService } from '@helgoland/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

// One of the languages configured for this app in assets/config/settings.json
// (which configures Deutsch, English and Portuguese). Settings.languages is
// typed as a single-element tuple, so exactly one entry is provided here.
const configuredLanguages: [{ label: string; code: string }] = [
  { label: 'Deutsch', code: 'de' }
];

@Injectable()
class TestSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({ languages: configuredLanguages });
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } }),
        RouterTestingModule
      ],
      providers: [
        { provide: SettingsService, useClass: TestSettingsService }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  // The component has no 'title' property; it exposes the configured languages.
  it(`should have the configured languages`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.languageList).toEqual(configuredLanguages);
  }));

  // The template has no h1; it renders the application brand in the navbar.
  it('should render the application brand in the navbar', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.navbar-brand').textContent).toContain('52N-Helgoland');
  }));
});
