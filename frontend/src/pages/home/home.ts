import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
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

function _window(): any {
  return window;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('fadeInOut', [
      state('in', style({
        opacity: 1,
        display: 'block'
      })),
      state('out', style({
        opacity: 0,
        display: 'none'
      })),
      transition('in => out', [
        animate('.5s')
      ]),
      transition('out => in', [
        animate('1s')
      ])
    ]),
      trigger('fadeInLine', [
      state('in', style({
        opacity: 1,
        display: 'block'
      })),
      state('out', style({
        opacity: 0,
        display: 'none'
      })),
      transition('in => out', [
        animate('.5s')
      ]),
      transition('out => in', [
        animate('.5s')
      ])
    ]),
    trigger('slideUp', [
      state('normal', style({
        'transform': 'translateY(0%)'
      })),
      state('up', style({
        'transform': 'translateY(-200px)',
          'font-size': '4em',
          'padding-top': '200px'
      })),
        transition('normal => up', [group([
        animate('1000ms ease-out')
      ])])
    ]),
      trigger('disableBtn', [
          state('enabled', style({
              'opacity': 1,
              'transform': 'translateY(0%)'
          })),
          state('disabled', style({
              'opacity': .4,
              'transform': 'translateY(100%)'
          })),
          transition('enabled => disabled', [group([
              animate('500ms')
          ])]),
          transition('disabled => enabled', [group([
              animate('500ms')
          ])]),
      ]),
  ]})
export class HomePage {
  showMedia: boolean = false;
    fadeInLine: boolean = false;
  loggedIn: boolean = true;
  youtubeCheck: boolean = false;
  redditCheck: boolean = false;
  facebookCheck: boolean = false;

  constructor(public navCtrl: NavController, private youtubePvd: YoutubeProvider, private storage: Storage, private _zone: NgZone) {
    console.log(storage);
    storage.set('test', '123');
  }

  start() {
      this.loggedIn = false;
      this.showMedia = true;
      setTimeout(() => this.fadeInLine = true, 500);
      setTimeout(() => document.getElementById("mainBtn").textContent = 'SUBMIT', 1000);
  }

  goTo(pageName: string) {
    this.navCtrl.push(pageName + 'Page');
  }

  loginYoutube() {
    // loading start
    this.youtubePvd.login()
    .subscribe(data => {
      let url: any = data;
      let that = this;
      let selfWindow = _window();

      selfWindow.loginYoutubeCallback = function(code) {
        that.loginYoutubeCallback.call(that, code);
      };

      window.open(url, 'popUp', 'width=500, height=500');
    });
  }

  loginYoutubeCallback(code) {
    this._zone.run(() => {
      console.log(code);
      this.storage.set('youtubeToken', code);
      this.loggedIn = true;
      // loading stop
    })
  }

  submit() {
    this.navCtrl.push('LoadingPage');
  }
}
