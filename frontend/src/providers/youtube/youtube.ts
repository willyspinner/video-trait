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
export class YoutubeProvider {

  constructor(public http: HttpClient) {
  }

  login(): Observable<Object> {
    return this.http.post(config.domain + ':' + config.port + '/login', '', {});
  }

}
