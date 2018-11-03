import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { YoutubeProvider } from '../../providers/youtube/youtube';

/**
 * Generated class for the YoutubePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-youtube',
  templateUrl: 'youtube.html',
})
export class YoutubePage {
  loginUrl: string;
  netErr: Object = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private youtubePvd: YoutubeProvider) {
    youtubePvd.login()
    .subscribe(res => {
      console.log(res);
      this.loginUrl = res;
    }, err => {
      this.netErr = err;
      console.error(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YoutubePage');
  }

}
