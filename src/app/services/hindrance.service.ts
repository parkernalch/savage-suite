import { Injectable } from '@angular/core';
import _Hindrance from '../models/Hindrance';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HindranceService {
  hindrances: _Hindrance[];
  newHindrance: _Hindrance;
  hindranceUrl: string;
  httpOptions: Object;

  constructor(private http: HttpClient) {
    this.hindranceUrl = "http://localhost:5000/api/hindrances";
    this.hindrances = [];
    this.newHindrance = null;
    this.httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem('userToken')) 
      }
    };
  }

  mapResToHindrance(result: Object): _Hindrance{
    let _H: _Hindrance = {
      id: result["_id"],
      name: result["name"],
      description: result["description"],
      type: result["type"],
      major: result["major"],
      creator: result["creator"]
    };
    return _H;
  }

  getHindrances():Observable<_Hindrance[]>{
    console.log("getting hindrances");
    this.hindrances = [];
    this.http.get<Object[]>(this.hindranceUrl, this.httpOptions).subscribe(hindrances => {
      hindrances.map(hindrance => {
        let H = this.mapResToHindrance(hindrance);
        this.hindrances.push(H);
      });
      // console.log('HindranceService Hindrances');
      // console.log(this.hindrances);
    });
    return of(this.hindrances);
  }

  getHindranceById(id: string): Observable<_Hindrance> {
    this.newHindrance = null;
    this.http.get<Object>(this.hindranceUrl + "/" + id, this.httpOptions).subscribe(hindrance => {
      console.log(hindrance);
      let H = this.mapResToHindrance(hindrance);
      this.newHindrance = H;
    });
    return of(this.newHindrance);
  }

  addHindrance(hindrance:_Hindrance): Observable<_Hindrance> {
    console.log('adding hindrance');
    this.newHindrance = null;
    this.http.post<Object[]>(this.hindranceUrl, hindrance, this.httpOptions).subscribe(hindrance => {
      console.log(hindrance);
      let H = this.mapResToHindrance(hindrance);
      this.newHindrance = H;
    });
    return of(this.newHindrance);
  }

  deleteHindrance(id: string): void {
    this.http.delete(this.hindranceUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }
}
