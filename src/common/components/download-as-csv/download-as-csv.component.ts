import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Timespan, InternalDatasetId } from '@helgoland/core';
import moment from 'moment';

@Component({
  selector: 'n52-download-as-csv',
  templateUrl: './download-as-csv.component.html',
  styleUrls: ['./download-as-csv.component.scss']
})
export class DownloadAsCsvComponent implements OnChanges {

  @Input()
  public internalId: InternalDatasetId;

  @Input()
  public timeInterval: Timespan;

  @Input()
  public language: string;

  public downloadLink: string;
  private _requestParams: Map<string, string>;

  constructor() { }

  // ngOnInit() {
  //   if (!this._requestParams) {
  //     this.prepareRequestParams();
  //     this.createCsvLink(this.internalId.id, this.internalId.url);
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this._requestParams) {
      this.prepareRequestParams();
      this.createCsvLink(this.internalId.id, this.internalId.url);
    }
    if (changes.timeInterval) {
      if (this.internalId && this.timeInterval) {
        const timespan = this.createRequestTimespan(this.timeInterval);
        this.updateCsvLink('timespan', timespan);
      }
    }
  }

  private prepareRequestParams() {
    this._requestParams = new Map();
    this._requestParams.set('generalize', 'false');
    this._requestParams.set('locale', (this.language && this.language !== '' ? this.language : 'en'));
    this._requestParams.set('zip', 'true');
    this._requestParams.set('bom', 'true');
  }

  private createCsvLink(id: String, apiUrl: string) {
    const idconv: string = String(id.match(/\d+$/)); // select last set of digits (e.g. id="this3_id_45_is_89" ==> 89)
    let url = this.createBaseUrl(apiUrl, 'timeseries', idconv) + '/getData.zip?'; // timeseries vs datasets
    url = this.addUrlParams(url, this._requestParams);
    this.downloadLink = url;
  }

  private createBaseUrl(apiUrl: string, endpoint: string, id?: string) {
    let requestUrl = apiUrl + endpoint;
    if (id) { requestUrl += '/' + id; }
    return requestUrl;
  }

  private addUrlParams(url: string, params: Map<string, string>): string {
    params.forEach((value: string, key: string) => {
      url += key + '=' + value + '&';
    });
    return url.slice(0, -1);
  }

  private createRequestTimespan(timespan: Timespan): string {
    return encodeURIComponent(moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  private updateRequestParam(key: string, value: string) {
    this._requestParams.set(key, value);
  }

  private updateCsvLink(key: string, value: string) {
    this.updateRequestParam(key, value);
    this.createCsvLink(this.internalId.id, this.internalId.url);
  }

}
