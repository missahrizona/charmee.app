import { DeviceInfo } from 'ngx-device-detector';
import { Component, OnInit } from '@angular/core';
import { GlobalsService } from './services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private globals: GlobalsService) {}

  welcomeDone: boolean = false;

  ngOnInit(): void {
    (async () => {
      // Do something before delay
      console.log('before delay');

      await this.delay(3000);

      this.welcomeDone = true;
    })();
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
