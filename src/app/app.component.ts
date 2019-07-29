import { Component } from '@angular/core';
import { ElectronService } from '../providers/electron.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public electronService: ElectronService) {
  }
}
