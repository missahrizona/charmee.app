import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalsService } from './services/globals.service';
import { HomeComponent } from './components/home/home.component';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, LayoutModule, ButtonModule],
  bootstrap: [AppComponent],
  providers: [GlobalsService, { provide: Window, useValue: window }],
})
export class AppModule {}
