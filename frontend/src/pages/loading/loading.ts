import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

import { DataProvider } from '../../providers/data/data';

interface Tokens {
  youtubeToken?: string;
  redditToken?: string;
  facebookToken?: string;
}

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
  animations: [
    trigger('animate', [
      state('in', style({
        opacity: 1,
        display: 'block'
      })),
      state('out', style({
        opacity: 0,
        display: 'none'
      })),
      transition('in => out', [
        animate('1s')
      ]),
      transition('out => in', [
        animate('1s')
      ]),
    ])
  ]
})
export class LoadingPage {

  msgTimes: number[] = [0,0,0,0,0,0];
  currentMsg: number = 0;
  minMsgTime: number = 3;
  maxMsgTime: number = 7;
  minTotalTime: number = 25;
  maxTotalTime: number = 35;
  enterAnims: string[] = [
      "fadeIn",
      "fadeInDown",
      "fadeInRight",
      "fadeInLeft",
      "fadeInUp",
      "flipInX",
      "flipInY",
      "zoomIn",
      "zoomInLeft",
      "zoomInRight",
      "slideIn",
      "slideInLeft",
      "slideInRight"
  ];
  exitAnims: string[] = [
      "fadeOut",
      "fadeOutDown",
      "fadeOutRight",
      "fadeOutLeft",
      "fadeOutUp",
      "flipOutX",
      "flipOutY",
      "zoomOut",
      "zoomOutLeft",
      "zoomOutRight",
      "slideOut",
      "slideOutLeft",
      "slideOutRight"
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private dataPvd: DataProvider) {
      this.generateMsgTimes();
  }

  randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomAnim(enter) {
      if(enter) {
          var x = this.randomInt(0, this.enterAnims.length - 1);
          return this.enterAnims[x]
      }
      return this.exitAnims[this.randomInt(0, this.exitAnims.length - 1)]
  }

  showNextMsg() {
      let backup: string = "";
      if(this.currentMsg != 0 && this.currentMsg != this.msgTimes.length - 1) {
          let exitAnim: string = " animated " + this.randomAnim(false);
          let backup: string = document.getElementById("msg" + this.currentMsg).className;
          document.getElementById("msg" + this.currentMsg).className += exitAnim;
      }

      this.currentMsg += 1;

      if(this.currentMsg < this.msgTimes.length) {

      let enterAnim: string = " animated " + this.randomAnim(true);
      backup = document.getElementById("msg" + this.currentMsg).className;
      document.getElementById("msg" + this.currentMsg).className += enterAnim;
      }
  }

  generateMsgTimes() {
      let totalTime:number = this.randomInt(25, 35);
      let filledTime:number = 0;
      for(var i = 0; i < 6; i++) {
          if(i == 5) {
              this.msgTimes[i] = totalTime - filledTime;
          }
          else if ((totalTime - filledTime) < ((7 - i) * 3)) {
              this.msgTimes[i] = this.randomInt(3, 3 + totalTime - filledTime - (6 - i) * 3);
          }
          else {
              this.msgTimes[i] = this.randomInt(3, 7);
          }
          filledTime += this.msgTimes[i];
      }
  }

  startMessages() {
      if(this.currentMsg < this.msgTimes.length - 1) {
          if(this.currentMsg == 0) {
              setTimeout(() => this.showNextMsg(), 2000);
              setTimeout(() => this.startMessages(), 2100);
          }
          else {
            setTimeout(() => {this.startMessages(); this.showNextMsg(); }, this.msgTimes[this.currentMsg] * 1000);
          }
      }
  }

  ionViewDidLoad() {
    this.startMessages();

    this.storage.get('youtubeToken')
    .then(youtubeToken => {
      this.storage.get('redditToken')
      .then(redditToken => {
        this.storage.get('facebookToken')
        .then(facebookToken => {
          let tokens: Tokens;
          if (youtubeToken) {
            tokens.youtubeToken = youtubeToken;
          }
          if (redditToken) {
            tokens.redditToken = redditToken;
          }
          if (facebookToken) {
            tokens.facebookToken = facebookToken;
          }

          this.dataPvd.sendTokens(tokens)
          .subscribe(data => {
            console.log(data);
            this.storage.set('result', data);
            this.navCtrl.push('ResultPage');
          });
        });
      });
    });
  }



}
