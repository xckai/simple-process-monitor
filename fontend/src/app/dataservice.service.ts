import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IAppItem } from './app.component';
import { Observable, of,interval } from '../../node_modules/rxjs';
const apps = [{
  name: "rsync", id: 'ss', webui:'s',operations: [{ commandID: '1', commandName: "Start" }, 
    { commandID: '1', commandName: "Stop" }, 
    { commandID: '1', commandName: "Start" }]}, { name: "rsync", id: 'ss' }, 
  { name: "rsync", id: 'ss',webui:'www' ,operations: [{ commandID: '1', commandName: "Start" }]},
 { name: "rsync", id: 'ss' }, { name: "rsync", id: 'ss' }]
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http: HttpClient) { 
    this.heartBeatInterval=15000
    this.heartBeatBus=interval(this.heartBeatInterval)
  }
  heartBeatInterval:number
  heartBeatBus:Observable<number>
  getApps$(): Observable<any> {

    return  this.http.get('/api/apps')
  }
  getCommandResult$(id, commandId): Observable<any> {
    return of("")
  }
  execCommand(id, commandId, args?): Observable<any> {
    return  this.http.post('/api/exec/',{appID:id,commandID:commandId,args})
  }
  execStatusCommand(id,commandId,args?):Observable<any>{
      return  this.http.post('/api/exec/',{appID:id,commandID:commandId,args})
  }
  getHeartBeatEvent(){
    return this.heartBeatBus
  }
}
