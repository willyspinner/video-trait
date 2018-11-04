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

  login(): Observable<Object> {
    return this.http.get(config.domain + ':' + config.port + '/authUrl', {
      responseType: 'text'
    });
  }

}
