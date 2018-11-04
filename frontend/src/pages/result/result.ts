import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { YoutubeProvider } from '../../providers/youtube/youtube';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private youtubePvd: YoutubeProvider) {
  }

  ionViewDidLoad() {
    this.storage.get('youtubeToken')
    .then(token => {
      youtubePvd.sendToken(token)
      .subscribe(data => {
        console.log(data);
      });
    });
  }

}
