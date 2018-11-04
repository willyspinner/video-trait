import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../config';

/*
  Generated class for the YoutubeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  constructor(public http: HttpClient) {
  }

  getRoute(): string {
    if (config.prod) {
      return config.domain + '/api';
    } else {
      return 'http://localhost:' + config.port + '/api';
    }
  }

  loginYoutube(): Observable<Object> {
    return this.http.get(this.getRoute() + '/authUrl', {
      responseType: 'text'
    });
  }

  sendTokenYoutube(code: string): Observable<Object> {
    return this.http.post(this.getRoute() + '/analyze', {
      token: code
    });
  }

  loginReddit(): Observable<Object> {
    return this.http.get(this.getRoute() + '/authReddit', {
      responseType: 'text'
    });
  }

  sendTokenReddit(code: string): Observable<Object> {
    return this.http.post(this.getRoute() + '/analyze', {
      token: code
    });
  }

}
