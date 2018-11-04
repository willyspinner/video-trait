import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'result/:id'
})
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  id: number;
  result: any;
  introvert: boolean;
  observant: boolean;
  feeling: boolean;
  prospecting: boolean;
  seed: number = 1;
  nickname: string = '';
  nicknameColor: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.id = navParams.data.id;
    console.log(this.id);
  }

  handleResult() {
      var qq = "";
      var clr = "";
      switch(this.result) {
          case "INTJ":
              qq = "Architect";
              clr = "#A085B0";
              break;
          case "INTP":
              qq = "Logician";
              clr = "#A085B0";
              break;
          case "ENTJ":
              qq = "Commander";
              clr = "#A085B0";
              break;
          case "ENTP":
              qq = "Debater";
              clr = "#A085B0";
              break;
          case "INFJ":
              qq = "Advocate";
              clr = "#D8E157";
              break;
          case "INFP":
              qq = "Mediator";
              clr = "#D8E157";
              break;
          case "ENFJ":
              qq = "Protagonist";
              clr = "#D8E157";
              break;
          case "ENFP":
              qq = "Campaigner";
              clr = "#D8E157";
              break;
          case "ISTJ":
              qq = "Logistician";
              clr = "#3CA0BA";
              break;
          case "ISFJ":
              qq = "Defender";
              clr = "#3CA0BA";
              break;
          case "ESTJ":
              qq = "Executive";
              clr = "#3CA0BA";
              break;
          case "ESFJ":
              qq = "Consul";
              clr = "#3CA0BA";
              break;
          case "ISTP":
              qq = "Virtuoso";
              clr = "#BF8F00";
              break;
          case "ISFP":
              qq = "Adventurer";
              clr = "#BF8F00";
              break;
          case "ESTP":
              qq = "Entrepreneur";
              clr = "#BF8F00";
              break;
          case "ESFP":
              qq = "Entertainer";
              clr = "#BF8F00";
              break;
      }
      this.nickname = qq;
      this.nicknameColor = clr;
      this.introvert = this.result[0] == 'I';
      this.observant = this.result[1] == 'S';
      this.feeling = this.result[2] == 'F';
      this.prospecting = this.result[3] == 'P';
      document.getElementById("mind").querySelector('.trait-label').innerHTML = this.introvert ? "<b>I</b>NTROVERTED" : "<b>E</b>XTROVERTED";
      document.getElementById("energy").querySelector('.trait-label').innerHTML = this.observant ? "OB<b>S</b>ERVANT" : "I<b>N</b>TUITIVE";
      document.getElementById("nature").querySelector('.trait-label').innerHTML = this.feeling ? "<b>F</b>EELING" : "<b>T</b>HINKING";
      document.getElementById("tactics").querySelector('.trait-label').innerHTML = this.prospecting ? "<b>P</b>ROSPECTING" : "<b>J</b>UDGING";

      if(this.id == -1) {
      this.storage.get("facebookToken").then(fbTok => {this.storage.get("youtubeToken").then(youtubeTok => {this.storage.get("redditToken").then(redditTok => {

      var res = (Math.random() * 30000) + 10;
      if(fbTok != null)
          for(var x = 0; x < 6; x++)
              res += fbTok[x].charCodeAt(0) * Math.pow(10,x);
      if(youtubeTok != null)
          for(var x = 0; x < 6; x++)
              res += youtubeTok[x].charCodeAt(0) * Math.pow(10,x);
      if(redditTok != null)
          for(var x = 0; x < 6; x++)
              res += redditTok[x].charCodeAt(0) * Math.pow(10,x);
      var x = (this.introvert ? 8 : 0) + (this.observant ? 4 : 0) + (this.feeling ? 2 : 0) + (this.prospecting ? 1 : 0);
      this.seed = parseInt(res.toString() + (parseInt(res.toString().substring(0,2)) + x).toString());
          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#result/' + this.seed.toString();
          window.history.pushState({path:newurl},'',newurl);
          window.location.reload(true);
      })})})
      } else {
          if(this.seed != this.id) {
          this.seed = this.id;
          var x = parseInt(this.id.toString().substring(this.id.toString().length - 2, this.id.toString().length)) -parseInt(this.id.toString().substring(0,2));
          var l1 = x >= 8 ? "I" : "E";
          var l2 = l1 == "I" ? (x - 8 >= 4 ? "S" : "N") : (x >= 4 ? "S" : "N");
          var l3 = l1 == "I" ? (l2 == "S" ? (x - 12 >= 2 ? "F" : "T") : (x - 8 >= 2 ? "F" : "T")) : (l2 == "S" ? (x - 4 >= 2 ? "F" : "T") : (x >= 2 ? "F" : "T"));
          var l4 = x % 2 == 1 ? "P" : "J";
          this.result = l1 + l2 + l3 + l4;
          this.handleResult();
      }
      }
      document.getElementById("mind").querySelector('.percent').innerHTML = ((51 + Math.sqrt(100 * this.random() + this.random() * 20)).toString().substring(0, 2) + "% ") + (this.introvert ? "introverted" : "extroverted") + "!";
      document.getElementById("energy").querySelector('.percent').innerHTML = ((51 + Math.sqrt(100 * this.random() + this.random() * 20)).toString().substring(0, 2) + "% ") + (this.observant ? "observant" : "intuitive") + "!";
      document.getElementById("nature").querySelector('.percent').innerHTML = ((51 + Math.sqrt(100 * this.random() + this.random() * 20)).toString().substring(0, 2) + "% ") + (this.feeling ? "feeling" : "thinking") + "!";
      document.getElementById("tactics").querySelector('.percent').innerHTML = ((51 + Math.sqrt(100 * this.random() + this.random() * 20)).toString().substring(0, 2) + "% ") + (this.prospecting ? "prospecting" : "judging") + "!";

  }

    random() {
        var x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

  ionViewDidLoad() {
    this.storage.get('result')
    .then(result => {
      this.result = result;
      this.handleResult();
    });
  }

}
