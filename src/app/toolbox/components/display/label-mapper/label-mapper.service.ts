import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { Settings } from './../../../../services/settings.service';

declare var $: any;

@Injectable()
export class LabelMapperService {

    constructor(
        private httpClient: HttpClient,
        private settings: Settings
    ) { }

    public getMappedLabel(label: string): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            if (!this.settings.config.solveLabels) {
                this.confirmLabel(observer, label);
            } else {
                const url = this.findUrl(label);
                if (url) {
                    const labelUrl = this.settings.config.proxyUrl ? this.settings.config.proxyUrl + url : url;
                    this.httpClient.get(labelUrl, {responseType: 'text'}).subscribe((res) => {
                        try {
                            const xml = $.parseXML(res);
                            label = label.replace(url, $(xml).find('prefLabel').text());
                        } catch (error) {
                            // currently do nothing and use old label
                        }
                        this.confirmLabel(observer, label);
                    }, (error) => this.confirmLabel(observer, label));
                } else {
                    this.confirmLabel(observer, label);
                }
            }
        });
    }

    private confirmLabel(observer: Observer<string>, label: string) {
        observer.next(label);
        observer.complete();
    }

    private findUrl(label: string) {
        const source = (label || '').toString();
        const regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?&\/\/=]+)/g;
        const matchArray = regexToken.exec(source);
        if (matchArray !== null) {
            return matchArray[0];
        }
        return null;
    }
}
