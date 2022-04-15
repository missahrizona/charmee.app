import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

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
