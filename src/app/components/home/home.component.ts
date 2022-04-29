import { Component, OnInit, AfterViewInit } from '@angular/core';
import GearSet from './gears';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(public window: Window) {
    this.frameworks = [
      { className: 'angular', url: 'https://angular.io' },
      { className: 'nodejs', url: 'https://nodejs.org' },
      { className: 'mongodb', url: 'https://www.mongodb.com' },
      { className: 'gcp', url: 'https://cloud.google.com/' },
    ];
    this.welcomeDone = false;
    this.animateP1 = false;
    this.animateP2 = false;
    this.animateP3 = false;
    this.init = false;
  }

  welcomeDone: boolean;
  animateP1: boolean;
  animateP2: boolean;
  animateP3: boolean;
  frameworks: any[];
  init: boolean;
  gearSet1?: GearSet;
  gearSet2?: GearSet;
  gearSet3?: GearSet;

  ngOnInit(): void {
    (async () => {
      await this.delay(3000);

      this.welcomeDone = true;
    })();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.init = true;
    });
    this.gearSet1 = new GearSet('.gears-d3-canvas-p1');
    this.gearSet2 = new GearSet('.gears-d3-canvas-p2');
    this.gearSet3 = new GearSet('.gears-d3-canvas-p3');
  }

  openLinkNewTab(url: string) {
    window.open(url, '_blank');
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
