import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../config';
import { map } from 'rxjs/operators';

/*
  Generated class for the YoutubeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class YoutubeProvider {

  constructor(public http: HttpClient) {
  }

  getRoute(): string {
    if (config.prod) {
      return config.domain + '/api';
    } else {
      return 'http://localhost:' + config.port;
    }
  }

  login(): Observable<Object> {
    return this.http.get(this.getRoute() + '/authUrl', {
      responseType: 'text'
    });
  }

  sendToken(code: string): Observable<Object> {
    return this.http.post(this.getRoute() + '/analyze', {
      token: code
    });
  }

}
