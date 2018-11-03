import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  trigger,
  state,
  style,
  transition,
  animate
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
        animate('0.5s')
      ])
    ])
  ]
})
export class HomePage {
  showMedia: boolean = false;

  constructor(public navCtrl: NavController) {

  }

  start() {
    this.showMedia = true;
    console.log(this.showMedia);
  }
}
