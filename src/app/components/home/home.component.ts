import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

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

  @ViewChild('content') content!: ElementRef;
  @ViewChild('footer') footer!: ElementRef;
  @ViewChild('footeroverlay') footeroverlay!: ElementRef;
  @ViewChild('charmeesvg') charmeesvg!: ElementRef;

  welcomeDone: boolean;
  animateP1: boolean;
  animateP2: boolean;
  animateP3: boolean;
  frameworks: any[];
  init: boolean;

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

    setTimeout(() => {
      let footerheight = this.footer.nativeElement.offsetHeight;
      this.content.nativeElement.style.paddingBottom = `${footerheight}px`;
    }, 500);

    this.footer.nativeElement.style.opacity = '0';
  }

  openLinkNewTab(url: string) {
    window.open(url, '_blank');
  }

  scrolledover(evt: any) {
    let distance = evt.target.scrollTop;
    let total = evt.target.scrollHeight;

    if (distance / total >= 4 / 5) {
      this.footer.nativeElement.style.opacity = '1';
    } else {
      this.footer.nativeElement.style.opacity = '0';
    }
  }

  toggleLogo(evt: any) {
    this.charmeesvg.nativeElement.classList.toggle('active');
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
