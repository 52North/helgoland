import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetOptions, Timespan } from '@helgoland/core';
import { FavoriteService, JsonFavoriteExporterService, SingleFavorite } from '@helgoland/favorite';

import { TimeseriesService } from '../services/timeseries.service';


@Component({
  selector: 'n52-timeseries-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeseriesFavoritesComponent {

  public favorites: ExtendedSingleFavorite[];

  constructor(
    private favoriteSrvc: FavoriteService,
    private timeseriesService: TimeseriesService,
    private jsonExporter: JsonFavoriteExporterService,
    private router: Router
  ) {
    this.loadFavorites();
  }

  public addToDiagram(favorite: ExtendedSingleFavorite) {
    this.timeseriesService.addDataset(favorite.favorite.internalId);
    this.router.navigate(['timeseries/diagram']);
  }

  public deleteFavorite(favorite: ExtendedSingleFavorite) {
    const idx = this.favorites.findIndex(entry => entry.id === favorite.id);
    this.favorites.splice(idx, 1);
    this.favoriteSrvc.removeFavorite(favorite.id);
  }

  public setLabel(favorite: ExtendedSingleFavorite, label: string) {
    this.favoriteSrvc.changeLabel(favorite, label);
  }

  public importFavorites(event: Event) {
    this.jsonExporter.importFavorites(event).subscribe(() => this.loadFavorites());
  }

  public exportFavorites() {
    this.jsonExporter.exportFavorites();
  }

  private loadFavorites() {
    this.favorites = [];
    this.favoriteSrvc.getFavorites().forEach((entry) => {
      const option = new DatasetOptions(entry.favorite.internalId, '#FF0000');
      option.generalize = true;
      const timespan = new Timespan(entry.favorite.lastValue.timestamp - 604800000, entry.favorite.lastValue.timestamp);
      this.favorites.push({
        id: entry.id,
        label: entry.label,
        favorite: entry.favorite,
        timespan,
        option: new Map([[entry.favorite.internalId, option]])
      });
    });
  }
}

interface ExtendedSingleFavorite extends SingleFavorite {
  timespan: Timespan;
  option: Map<string, DatasetOptions>;
}
