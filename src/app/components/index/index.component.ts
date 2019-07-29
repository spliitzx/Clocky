import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {

  public time: string;

  // Inputs
  public timeInput: string;

  public saveLoading = false;

  constructor() { }

  ngOnInit() {
    this.time = '00:00:00';
  }

  save() {
    this.saveLoading = true;
    setTimeout(() => {
      this.saveLoading = false;
    }, 1500);
  }

}
