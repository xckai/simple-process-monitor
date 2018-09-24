import { Component, OnInit } from '@angular/core';
import { AppItemComponent } from './app-item/app-item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apps:AppItemComponent[]   
  ngOnInit(){
    this.apps=[]
    this.apps.push(new AppItemComponent)
  }
}
