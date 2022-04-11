import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  constructor(public deviceDetector: DeviceDetectorService) {
    this.device = deviceDetector.getDeviceInfo();
  }

  device: DeviceInfo;
}
