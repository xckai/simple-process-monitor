import { Component, OnInit } from '@angular/core';
interface operator{
  commandID?:string
  commandName?:string
  url?:string
}
@Component({
  selector: 'app-app-item',
  templateUrl: './app-item.component.html',
  styleUrls: ['./app-item.component.scss']
})
export class AppItemComponent implements OnInit {

  constructor() {
    
  }
  id:string
  name:string
  status:string
  operation: operator[]
  ngOnInit() {
    this.name="TEST"
    this.operation=[{commandID:"1",commandName:"启动"}]
  }

}
