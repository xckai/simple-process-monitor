import { Component, OnInit } from '@angular/core';
import { AppItemComponent } from './app-item/app-item.component';
import { DataserviceService } from './dataservice.service';
export interface operator{
  commandID?:string
  commandName?:string
  url?:string
}
export interface IAppItem{
  name?:string
  id?:string
  status?:boolean
  cpu?:number|string
  mem?:number|string
  operations?:operator[]
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private ds:DataserviceService){

  }
  apps:IAppItem[]
  ngOnInit(){
    console.log(this.ds)
    this.ds.getApps$().subscribe(r=>{
      this.apps=r
    })
  }
}
