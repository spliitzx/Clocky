import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';
import { FileService } from '../../../providers/dir.service';
const moment = require('moment');

@Component({
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {

  public time: string;
  private seconds: number;
  private timeInterval: any;
  public folderPath: string = null;
  public isPaused = false;

  // Inputs
  public timeInput: string;
  public format: string;
  public completionMessage: string;

  public saveLoading = false;

  constructor(private electronService: ElectronService, private zone: NgZone, private fileService: FileService) { }

  ngOnInit() {
    const formatCache = localStorage.getItem('format') || 'HH:mm:ss';
    const seconds = localStorage.getItem('seconds') || '0';
    const pathCache = localStorage.getItem('path');

    this.seconds = (!isNaN(Number.parseInt(seconds, 0x0))) ? Math.round(Number.parseInt(seconds, 0x0)) : 0;
    const formatted = this.formatTime(formatCache);
    this.format = formatCache;
    this.time = formatted;
    this.timeInput = formatted;
    if (pathCache) { this.folderPath = pathCache; }
  }

  save() {
    this.saveLoading = true;

    this.seconds = moment.duration(this.timeInput).asSeconds();
    let format = this.format;
    this.time = this.formatTime(format);
    format = undefined;

    localStorage.setItem('format', this.format);
    localStorage.setItem('seconds', this.seconds.toString());

    setTimeout(() => {
      this.saveLoading = false;
    }, 1500);
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
          this.fileService.write(this.folderPath, this.time);
        } else {
          this.stopTimer();
          if (this.completionMessage) {
            this.time = this.completionMessage;
            this.fileService.write(this.folderPath, this.completionMessage);
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
    clearInterval(this.timeInterval);
    this.timeInterval = undefined;
    this.seconds = 0;
    this.time = this.formatTime(this.format);
    this.fileService.write(this.folderPath, this.time);
    this.isPaused = false;
  }

  formatTime(format: string, customSeconds?: number) {
    const seconds = customSeconds || this.seconds;
    return moment.utc(seconds * 1000).format(format || 'HH:mm:ss');
  }

  browse() {
    this.electronService.remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      paths => {
        if (!paths || paths.length === 0) {
          return;
        }

        this.zone.run(() => {
          const newPath = paths[0] + '\\countdown.txt';
          this.folderPath = newPath;
          localStorage.setItem('path', newPath);
        });
      }
    );
  }

  typeTime() {
    const length = this.timeInput.length;
    if ([2, 5].indexOf(length) + 1) {
      this.timeInput += ':';
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      if (this.seconds === 0) { return; }
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  get imageUrl() {
    const pause = '/assets/img/icon_pause.png';
    const play = '/assets/img/icon_play.png';

    return this.isPaused ? pause : play;
  }

}
