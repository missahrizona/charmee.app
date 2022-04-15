import { DeviceInfo } from 'ngx-device-detector';
import { Component, OnInit } from '@angular/core';
import { GlobalsService } from './services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private globals: GlobalsService) {}
}
