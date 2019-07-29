import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
  }

  close() {
    this.electronService.remote.getCurrentWindow().close();
    this.electronService.remote.app.exit(0); // if not exit
  }

  minimize() {
    this.electronService.remote.getCurrentWindow().minimize();
  }

  maximize() {
    this.electronService.remote.getCurrentWindow().maximize();
  }

}
