import { Injectable } from '@angular/core';
import _Power, { _PowerInstance } from '../models/Power';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PowerService {
  powers: _Power[];
  newPower: _Power;
  powerInstances: _PowerInstance[];
  newPowerInstance: _PowerInstance;
  basePowerUrl: string;
  trappedPowerUrl: string;
  httpOptions: Object;

  constructor(private http: HttpClient) {
    this.powers = [];
    this.basePowerUrl = "http://localhost:5000/api/powers/core"; 
    this.trappedPowerUrl = "hhtp://localhost:5000/api/powers";
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem('userToken'))
      })
    };
  }

  getPowers(): Observable<_Power[]> {
    this.http.get<_Power[]>(this.basePowerUrl, this.httpOptions).subscribe(powers=> {
      console.log(powers);
      this.powers = powers;
    });

    return of(this.powers); 
  }

  addPower(power:_Power): Observable<_Power> {
    this.http.post<_Power>(this.basePowerUrl, power, this.httpOptions).subscribe(power => {
      console.log(power);
      this.newPower = power;
    });

    return of(this.newPower);
  }

  deletePower(id: string): void {
    this.http.delete(this.basePowerUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }

  getPowerInstances(): Observable<_PowerInstance[]> {
    this.http.get<_PowerInstance[]>(this.trappedPowerUrl, this.httpOptions).subscribe(pis => {
      console.log(pis);
      this.powerInstances = pis;
    });

    return of(this.powerInstances);
  }

  addPowerInstance(pi: _PowerInstance): Observable<_PowerInstance> {
    this.http.post<_PowerInstance>(this.trappedPowerUrl, pi, this.httpOptions).subscribe(pi => {
      console.log(pi);
      this.newPowerInstance = pi;
    });

    return of(this.newPowerInstance);
  }

  deletePowerInstance(id: string): void {
    this.http.delete(this.trappedPowerUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }
} 