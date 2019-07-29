import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from '../providers/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public show = false;
  public updateMessage = 'Checking for updates...';

  constructor(public electronService: ElectronService, private zone: NgZone) {
  }

  ngOnInit() {
    this.electronService.ipcRenderer.on('update-not-available', () => {
      this.message = 'No updates found.';
      this.zone.run(() => {
        this.show = true;
      });
    });

    this.electronService.ipcRenderer.on('update-available', () => {
      this.message = 'Update found, downloading update...';
    });

    this.electronService.ipcRenderer.on('update-downloaded', () => {
      this.message = 'Update downloaded, restarting...';
    });

    this.electronService.ipcRenderer.on('update-error', () => {
      this.message = 'An error occurred, starting app...';
      setTimeout(() => {
        this.zone.run(() => {
          this.show = true;
        });
      }, 1000);
    });
  }

  set message(message: string) {
    this.zone.run(() => {
      this.updateMessage = message;
    });
  }
}
