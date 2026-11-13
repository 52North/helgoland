import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalStorage, NotifierService } from '@helgoland/core';
import { FavoriteService } from '@helgoland/favorite';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CustomFavoriteTogglerComponent } from './custom-favorite-toggler.component';

describe('CustomFavoriteTogglerComponent', () => {
  let component: CustomFavoriteTogglerComponent;
  let fixture: ComponentFixture<CustomFavoriteTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFavoriteTogglerComponent ],
      imports: [
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } })
      ],
      providers: [FavoriteService, LocalStorage, NotifierService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFavoriteTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
