import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  group
} from '@angular/animations';

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
    trigger('slideUp', [
      state('normal', style({
        'transform': 'translateY(0%)',
          'font-size': '72px',
      })),
      state('up', style({
        'transform': 'translateY(-200px)',
          'font-size': '48px'
      })),
        transition('normal => up', [group([
        animate('1000ms ease-out', style({
            'transform': 'translateY(-200px)',
            'font-size': '48px',
        }))
      ])])
    ]),
      trigger('disableBtn', [
          state('enabled', style({
              'opacity': 1
          })),
          state('disabled', style({
              'opacity': .4
          })),
          transition('enabled => disabled', [group([
              animate('500ms', style({
                  'opacity': .4
              }))
          ])]),
          transition('disabled => enabled', [group([
              animate('500ms', style({
                  'opacity': 1
              }))
          ])]),
      ])
  ]})
export class HomePage {
    showMedia: boolean = false;
    loggedIn = true;
    media: object = {
    youtube: false,
    reddit: false,
    facebook: false
  }

  constructor(public navCtrl: NavController) {

  }

  start() {
      this.loggedIn = false;
      this.showMedia = true;
      setTimeout(() => document.getElementById("app-title").style.borderBottom = '1px #3dbfbf solid', 1000);
//      setTimeout(() => document.getElementById("app-title").style.boxShadow = '0px 10px 21px 0px rgba(0,0,0,0.75)', 1000);
  }

  goTo(pageName: string) {
    this.navCtrl.push(pageName + 'Page');
  }

  loginYoutube() {
    window.open("http://google.com", "myWindow", 'width=500,height=500');
  }
}
