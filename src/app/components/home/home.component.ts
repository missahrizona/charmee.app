import { Component, OnInit } from '@angular/core';
import main from './gears';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {
    this.frameworks = [
      { className: 'angular', url: 'https://angular.io' },
      { className: 'nodejs', url: 'https://nodejs.org' },
      { className: 'mongodb', url: 'https://www.mongodb.com' },
      { className: 'gcp', url: 'https://cloud.google.com/' },
    ];
    this.welcomeDone = false;
    this.animateP1 = false;
    this.animateP2 = false;
  }

  welcomeDone: boolean;
  animateP1: boolean;
  animateP2: boolean;
  frameworks: any[];

  ngOnInit(): void {
    main('.gears-d3-canvas-p1');
    main('.gears-d3-canvas-p2');
    (async () => {
      // Do something before delay
      console.log('before delay');

      await this.delay(3000);

      this.welcomeDone = true;
    })();
  }

  openLinkNewTab(url: string) {
    window.open(url, '_blank');
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
