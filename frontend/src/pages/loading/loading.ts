import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  group
} from '@angular/animations';

import { YoutubeProvider } from '../../providers/youtube/youtube';

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
      }))
    ])
  ]
})
export class LoadingPage {

  msgTimes: number[] = [0,0,0,0,0,0];
  currentMsg: number = 0;
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private youtubePvd: YoutubeProvider) {
      this.generateMsgTimes();
  }

  randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
    
  randomAnim(enter) {
      if(enter)
          return this.enterAnims[this.randomInt(0, this.enterAnims.length)]
      return this.exitAnims[this.randomInt(0, this.exitAnims.length)]
  }
    
  showNextMsg() {
      let backup: string = "";
      if(this.currentMsg != 0) {
          let exitAnim: string = "animated " + this.randomAnim(false);
          let backup: string = document.getElementById("msg" + this.currentMsg).className;
          document.getElementById("msg" + this.currentMsg).className += exitAnim;
          document.getElementById("msg" + this.currentMsg).className = backup;
      }
      
      this.currentMsg += 1;
      
      console.log("msg" + this.currentMsg)
      
      let enterAnim: string = "animated " + this.randomAnim(true);
      backup = document.getElementById("msg" + this.currentMsg).className;
      document.getElementById("msg" + this.currentMsg).className += enterAnim;
      document.getElementById("msg" + this.currentMsg).className = backup;
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
    
  async startMessages() {
      let sleep = (ms) => {          
         return new Promise((resolve: Function) => { resolve(ms); });
      }
      await sleep(5000);
      this.showNextMsg();
  }

  ionViewDidLoad() {
      this.startMessages();
    this.storage.get('youtubeToken')
    .then(token => {
      this.youtubePvd.sendToken(token)
      .subscribe(data => {
        console.log(data);
        this.storage.set('result', JSON.stringify(data));
        this.navCtrl.push('ResultPage');
      });
    });
  }
    
  

}
