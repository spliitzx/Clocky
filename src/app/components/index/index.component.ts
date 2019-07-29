import { Component, OnInit } from '@angular/core';
const moment = require('moment');

@Component({
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {

  public time: string;
  private seconds: number;
  private timeInterval: any;

  // Inputs
  public timeInput: string;
  public format: string;

  public saveLoading = false;

  constructor() { }

  ngOnInit() {
    this.time = '00:00:00';
  }

  save() {
    this.saveLoading = true;

    this.seconds = moment.duration(this.timeInput).asSeconds();

    setTimeout(() => {
      this.saveLoading = false;
    }, 1500);

    this.startTimer();
  }

  startTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

    if (this.seconds) {
      this.timeInterval = setInterval(() => {
        this.time = this.formatTime();
        if (this.seconds > 0) {
          this.seconds--;
        } else {
          this.stopTimer();
        }
      }, 1000);
    }
  }

  pauseTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = undefined;
    }
  }

  stopTimer() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = undefined;
      this.time = '00:00:00';
      this.seconds = null;
    }
  }

  formatTime() {
    const seconds = this.seconds;
    return moment.utc(seconds * 1000).format('HH:mm:ss');
  }

}
