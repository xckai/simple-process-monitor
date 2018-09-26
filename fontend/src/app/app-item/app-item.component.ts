import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  IAppItem,
  operator
} from '../app.component';
import {
  DataserviceService
} from '../dataservice.service';
import * as _ from "lodash"
import { Subscription } from 'rxjs';
const hostname=window.location.hostname
const port= window.location.port
function PaserUrl(url:string){
     return _(url).replace('{hostname}',hostname).replace('{port}',port)
}
@Component({
  selector: 'app-app-item',
  templateUrl: './app-item.component.html',
  styleUrls: ['./app-item.component.scss']
})
export class AppItemComponent implements OnInit {

  constructor(private ds: DataserviceService) {
    this.isExecing=false;
  } 
  @Input("itemData")
  itemData: IAppItem
  execResult:string
  isExecing:boolean
  updatingStatus:boolean
  heartBeatSubscribe:Subscription
  ngOnInit() {
    this.reset()
  }
  updateStatus() {
    this.updatingStatus=true
    this.ds.execStatusCommand(this.itemData.id, 'cpu').subscribe(r => {

      if (r.code == 0) {
        this.itemData.cpu = r.result
      } else {
        this.itemData.cpu = "NA"
      }
    },err=>{
      this.itemData.cpu = "NA"
    })
    this.ds.execStatusCommand(this.itemData.id, 'mem').subscribe(r => {

      if (r.code == 0) {
        this.itemData.mem = r.result
      } else {
        this.itemData.mem = "NA"
      }
    },err=>{
      this.itemData.mem = "NA"
    })
    this.ds.execStatusCommand(this.itemData.id, 'isActive').subscribe(r => {

      if (r.code == 0) {
        this.itemData.isActive = r.result == 0 ? false : true
      } else {
        this.itemData.isActive = false
      }
    },err=>{
      this.itemData.isActive = false
    })
    _.delay(()=>{
      this.updatingStatus=false
    },1000)
  }
  onRefresh(){
    this.updateStatus()
  }
  reset(){
    if(this.heartBeatSubscribe){
      this.heartBeatSubscribe.unsubscribe()
    }
    this.isExecing=false
    setTimeout(this.updateStatus.bind(this), Math.random() * 1000)
    this.heartBeatSubscribe=this.ds.getHeartBeatEvent().subscribe(r => {
      setTimeout(this.updateStatus.bind(this), Math.random() * 2000)
    })

  }
  onWebUI(str:string){
    window.open(PaserUrl(str))
  }
  onClick(op: operator) {
    this.heartBeatSubscribe.unsubscribe()
    this.isExecing=true;
    this.execResult='Processing ...'
    this.ds.execCommand(this.itemData.id, op.commandID).subscribe(r=>{
       this.execResult=r.result
       setTimeout(() => {
        this.reset() 
        }, 3000);
    },e=>{
      this.execResult="ERROR:"+e.error.result
      setTimeout(() => {
         this.reset() 
      }, 3000);
    })
  }

}
