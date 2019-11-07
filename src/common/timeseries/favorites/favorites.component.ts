import { Component, ViewEncapsulation } from '@angular/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { DatasetOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions, HoveringStyle } from '@helgoland/d3';
import { FavoriteService, JsonFavoriteExporterService, SingleFavorite } from '@helgoland/favorite';

import { TimeseriesRouter } from '../services/timeseries-router.service';
import { TimeseriesService } from '../services/timeseries.service';

// add i18n fragments
marker('favorite.notifier.remove-favorite');
marker('favorite.notifier.add-favorite');

interface ExtendedSingleFavorite extends SingleFavorite {
  timespan: Timespan;
  option: Map<string, DatasetOptions>;
}

interface EditableExtendedSingleFavorite extends ExtendedSingleFavorite {
  editLabel: boolean;
  editedLabel: string;
  loading: boolean;
}

@Component({
  selector: 'n52-timeseries-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeseriesFavoritesComponent {

  public favorites: EditableExtendedSingleFavorite[];

  public presenterOptions: D3PlotOptions = {
    hoverStyle: HoveringStyle.none,
    togglePanZoom: true,
    showTimeLabel: false
  };

  constructor(
    private favoriteSrvc: FavoriteService,
    private timeseriesService: TimeseriesService,
    private jsonExporter: JsonFavoriteExporterService,
    private router: TimeseriesRouter
  ) {
    this.loadFavorites();
  }

  public addToDiagram(favorite: ExtendedSingleFavorite) {
    this.timeseriesService.addDataset(favorite.favorite.internalId);
    this.router.navigateToDiagram();
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
        editLabel: false,
        editedLabel: entry.label,
        loading: false,
        timespan,
        option: new Map([[entry.favorite.internalId, option]])
      });
    });
  }
}
