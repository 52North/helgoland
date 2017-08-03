import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import * as $ from 'jquery';

@Injectable()
export class LabelMapperService {

    constructor(
        private http: Http
    ) { }

    public getMappedLabel(label: string): Observable<string> {
        // TODO add settingsService;
        const settingsService = {
            solveLabels: false
        };
        return new Observable<string>((observer: Observer<string>) => {
            if (settingsService.solveLabels) {
                this.confirmLabel(observer, label);
            } else {
                const url = this.findUrl(label);
                if (url) {
                    const labelUrl = 'https://cors-anywhere.herokuapp.com/' + url;
                    this.http.get(labelUrl).subscribe((res) => {
                        try {
                            const xml = $.parseXML(res.text());
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
