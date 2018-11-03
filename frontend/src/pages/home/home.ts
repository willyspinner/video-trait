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
    trigger('slideDown', [
      state('normal', style({
        'transform': 'translateY(0%)'
      })),
      state('down', style({
        'transform': 'translateY(100%)'
      })),
      transition('normal => down', [group([
        animate('200ms ease-in', style({
          'transform': 'translateY(100%)'
        }))
      ])]),
      transition('down => normal', [group([
        animate('200ms ease-in', style({
          'transform': 'translateY(0%)'
        }))
      ])])
    ])
  ]
})
export class HomePage {
  showMedia: boolean = false;
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
}
