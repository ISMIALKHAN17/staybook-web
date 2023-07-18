import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  public global_url:any = "https://frontend.staybook.pk/public/api/";
  constructor(public http: HttpClient) {}
  post(url:any,data:any,token:any){
   return  this.http.post(this.global_url+ url,data);
  }
  get(url:any,token:any){
    return  this.http.get(this.global_url+url);
   }
}
