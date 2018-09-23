import { BrowserModule } from '@angular/platform-browser';
import { NgModule  ,NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
