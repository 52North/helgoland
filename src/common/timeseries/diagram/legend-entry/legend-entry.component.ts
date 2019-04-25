import { Component, SimpleChanges } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { TimeseriesEntryComponent } from '@helgoland/depiction';
import moment from 'moment';

@Component({
  selector: 'n52-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent extends TimeseriesEntryComponent {

  public timeInterval: Timespan;
  private _requestParams: Map<string, string>;

  public isCollapsed: boolean = true;
  public downloadLink: string
  
  public ngOnInit(): void {
    super.ngOnInit();
    this.prepareRequestParams();
    let timespan = this.createRequestTimespan(this.timeInterval);
    this.updateRequestParam('timespan', timespan);
    this.createCsvLink(this.internalId.id, this.internalId.url);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.timeInterval) {
      if(this.internalId){
        let timespan = this.createRequestTimespan(this.timeInterval);
        this.updateRequestParam('timespan', timespan);
        this.createCsvLink(this.internalId.id, this.internalId.url);
      }
    }
  }

  private createCsvLink(id: string, apiUrl: string) {
    let url = this.createBaseUrl(apiUrl, 'timeseries', id)  + '/getData.zip?';
    url =  this.addUrlParams(url, this._requestParams);
    this.downloadLink = url;
  }

  private createBaseUrl(apiUrl: string, endpoint: string, id?: string) {
    let requestUrl = apiUrl + endpoint;
    if (id) { requestUrl += '/' + id; }
    
    return requestUrl;
  }

  private addUrlParams(url: string, params: Map<string, string>): string{
    params.forEach((value: string, key: string) => {
      url += key + '=' + value + '&';
    });
    return url.slice(0, -1);
  }

  private createRequestTimespan(timespan: Timespan): string {
    return encodeURIComponent(moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  private prepareRequestParams() {
    this._requestParams = new Map();
    this._requestParams.set('generalize', 'false');
    this._requestParams.set('locale', 'de');
    this._requestParams.set('zip', 'true');
    this._requestParams.set('bom', 'true');
  }

  private updateRequestParam(key: string, value: string){
      this._requestParams.set(key, value);
  }
 }
