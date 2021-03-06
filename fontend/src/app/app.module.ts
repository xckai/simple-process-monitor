import { BrowserModule } from '@angular/platform-browser';
import { NgModule  ,NO_ERRORS_SCHEMA} from '@angular/core';

import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppItemComponent } from './app-item/app-item.component';
import { DataserviceService } from './dataservice.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    AppItemComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
