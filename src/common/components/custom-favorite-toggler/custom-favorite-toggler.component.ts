import { Component } from '@angular/core';
import { FavoriteTogglerComponent } from '@helgoland/favorite';

@Component({
  selector: 'custom-favorite-toggler',
  templateUrl: './custom-favorite-toggler.component.html',
  styleUrls: ['./custom-favorite-toggler.component.scss']
})
export class CustomFavoriteTogglerComponent extends FavoriteTogglerComponent { }
