import { Injectable } from '@angular/core';
import { BasicAuthInformer, BasicAuthService } from '@helgoland/auth';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Observer } from 'rxjs';

import { BasicAuthComponent } from './basic-auth.component';

@Injectable()
export class BasicAuthInformerImplService implements BasicAuthInformer {

  constructor(
    private basicAuthSrvc: BasicAuthService,
    private modalService: NgbModal,
  ) { }

  public doBasicAuth(url: string): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {

      const ref = this.modalService.open(BasicAuthComponent, { backdrop: 'static' });
      (ref.componentInstance as BasicAuthComponent).serviceUrl = url;

      ref.result.then((res: { username: string, password: string }) => {
        if (res && res.username && res.password) {
          this.basicAuthSrvc.auth(res.username, res.password, url).subscribe(
            token => {
              observer.next(true);
              observer.complete();
            },
            error => {
              observer.next(false);
              observer.complete();
            }
          );
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

}
