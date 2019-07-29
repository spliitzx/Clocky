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
  public completionMessage: string;

  public saveLoading = false;

  constructor() { }

  ngOnInit() {
    const formatCache = localStorage.getItem('format') || 'HH:mm:ss';
    const seconds = localStorage.getItem('seconds') || '0';

    this.seconds = (!isNaN(Number.parseInt(seconds, 0x0))) ? Math.round(Number.parseInt(seconds, 0x0)) : 0;
    const formatted = this.formatTime(formatCache);
    this.format = formatCache;
    this.time = formatted;
    this.timeInput = formatted;
  }

  save() {
    this.saveLoading = true;

    this.seconds = moment.duration(this.timeInput).asSeconds();
    const format = this.format;
    this.time = this.formatTime(format);

    localStorage.setItem('format', this.format);
    localStorage.setItem('seconds', this.seconds.toString());

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
        this.time = this.formatTime(this.format);
        if (this.seconds > 0) {
          this.seconds--;
          localStorage.setItem('seconds', this.seconds.toString());
        } else {
          this.stopTimer();
          if (this.completionMessage) {
            this.time = this.completionMessage;
          }
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
      this.time = this.formatTime(this.format, 0);
      this.seconds = null;
    }
  }

  formatTime(format: string, customSeconds?: number) {
    const seconds = customSeconds || this.seconds;
    return moment.utc(seconds * 1000).format(format || 'HH:mm:ss');
  }

}
