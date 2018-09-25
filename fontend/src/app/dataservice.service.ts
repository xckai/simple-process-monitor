import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IAppItem } from './app.component';
import { Observable, of } from '../../node_modules/rxjs';
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

  constructor(private http: HttpClient) { }
  getApps$(): Observable<IAppItem[]> {

    return of(apps)
  }
  getCommandResult$(id, commandId): Observable<any> {
    return of("")
  }
  execCommand(id, commandId, args?): Observable<string> {
    console.log(id, commandId)
    return of("12")
  }
}
