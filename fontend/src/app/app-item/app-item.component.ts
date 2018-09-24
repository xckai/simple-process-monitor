import { Component, OnInit, Input } from '@angular/core';
import { IAppItem, operator } from '../app.component';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-app-item',
  templateUrl: './app-item.component.html',
  styleUrls: ['./app-item.component.scss']
})
export class AppItemComponent implements OnInit {

  constructor(private ds:DataserviceService) {
    
  }
  @Input("itemData")
  itemData:IAppItem
  ngOnInit() {
    this.ds.execCommand(this.itemData.id,'status').subscribe(r=>{r.trim()==""?this.itemData.status=false:this.itemData.status=true})
  }
  onClick(op:operator){
    this.ds.execCommand(this.itemData.id,op.commandID)
    
  }

}
