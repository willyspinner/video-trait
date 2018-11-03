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
        animate('0s')
      ]),
      transition('out => in', [
        animate('1s')
      ])
    ]),
    trigger('slideUp', [
      state('normal', style({
        'transform': 'translateY(0%)'
      })),
      state('up', style({
        'transform': 'translateY(-200px)'
      })),
        transition('normal => up', [group([
        animate('1000ms ease-out', style({
          'transform': 'translateY(-200px)'
        }))
      ])])
    ])
  ]
})
export class HomePage {
    showMedia: boolean = false;
    loggedIn = false;
    media: object = {
    youtube: false,
    reddit: false,
    facebook: false
  }

  constructor(public navCtrl: NavController) {

  }

  start() {
      this.showMedia = true;
  }

  goTo(pageName: string) {
    this.navCtrl.push(pageName + 'Page');
  }
}
