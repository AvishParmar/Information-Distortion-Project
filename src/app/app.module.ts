import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AnnotatePageComponent } from './annotate-page/annotate-page.component';
import { ValidatePageComponent } from './validate-page/validate-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AnnotatePageComponent,
    ValidatePageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
