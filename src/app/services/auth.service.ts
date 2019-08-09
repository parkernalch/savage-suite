import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs'; 
import {map } from 'rxjs/operators';

import { _User } from '../models/User';
import { RSA_NO_PADDING } from 'constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private UserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;

  apiUrl:string;

  constructor(private http: HttpClient) {
    this.UserSubject = new BehaviorSubject<_User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.UserSubject.asObservable();
    this.apiUrl = 'http://localhost:5000';
  }

  public get currentUserValue(): _User {
    return this.UserSubject.value;
  }

  login(username: string, password: string) {
    console.log("validating");
    let url = "/api/auth";
    this.http.post(url, {username, password})
      .subscribe(res => {
        if(Object.keys(res).includes("token") && Object.keys(res).includes("user")){
          // console.log(res["user"]);
          // console.log(res["token"]);
          localStorage.setItem('currentUser', JSON.stringify(res["user"]));
          localStorage.setItem('userToken', JSON.stringify(res["token"]));
        }
      });
      // .pipe(map( (user, token) => {
      //   console.log(user, token);
      //   if(user && token){
      //     localStorage.setItem('currentUser', JSON.stringify(user));
      //     localStorage.setItem('userToken', JSON.stringify(token));
      //   }

      //   return user;
      // }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.UserSubject.next(null);
  }
}
