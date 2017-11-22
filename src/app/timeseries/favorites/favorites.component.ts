import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DatasetOptions, FavoriteService, PlotOptions, SingleFavorite, Timespan } from 'helgoland-toolbox';

import { TimeseriesService } from '../services/timeseries.service';

@Component({
  selector: 'n52-timeseries-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimeseriesFavoritesComponent {

  public favorites: ExtendedSingleFavorite[];

  public diagramOptions: PlotOptions = {
    crosshair: {
      mode: 'x'
    },
    grid: {
      autoHighlight: true,
      hoverable: true
    },
    legend: {
      show: false
    },
    selection: {
      mode: null
    },
    series: {
      lines: {
        fill: false,
        show: true
      },
      points: {
        fill: true,
        radius: 2,
        show: false
      },
      shadowSize: 1
    },
    touch: {
      delayTouchEnded: 200,
      pan: 'x',
      scale: ''
    },
    xaxis: {
      mode: 'time',
      timezone: 'browser',
      // monthNames: monthNamesTranslaterServ.getMonthNames()
      //            timeformat: '%Y/%m/%d',
      // use these the following two lines to have small ticks at the bottom ob the diagram
      //            tickLength: 5,
      //            tickColor: '#000'
    },
    yaxis: {
      hideLabel: true,
      min: null,
      panRange: false,
      show: true,
    }
  };

  constructor(
    private favoriteSrvc: FavoriteService,
    private timeseriesService: TimeseriesService,
    private router: Router
  ) {
    this.favorites = [];
    favoriteSrvc.getFavorites().forEach((entry) => {
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

}

interface ExtendedSingleFavorite extends SingleFavorite {
  timespan: Timespan;
  option: Map<string, DatasetOptions>;
}
