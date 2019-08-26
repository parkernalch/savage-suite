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
    this.trappedPowerUrl = "http://localhost:5000/api/powers";
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem('userToken'))
      })
    };
  }

  mapResToPower(result: Object): _Power {
    let _P: _Power = {
      id: result["_id"],
      name: result["name"],
      ruletext: result["ruletext"],
      effect: result["effect"],
      rank: result["rank"],
      cost: result["cost"],
      range: result["range"],
      duration: result["duration"],
      modifiers: result["modifiers"],
      creator: result["creator"]
    };
    if(Object.keys(result).includes('specialCost')){
      _P.specialCost = result['specialCost'];
    }
    return _P;
  }

  mapResToPowerInstance(result: Object): _PowerInstance {
    // let piPowerID = result["power"];
    // let piPower: _Power;
    // this.getPowerById(piPowerID).subscribe(power => piPower = power);
    let _PI: _PowerInstance = {
      id: result["_id"],
      name: result["name"],
      cost: result["cost"],
      effect: result["effect"],
      trapping: result["trapping"],
      // sustain: result["sustain"],
      duration: result["duration"],
      range: result["range"],
      power: result["power"],
      notes: result["notes"],
      creator: result["creator"]
    }; 
    return _PI;
  }

  getPowers(): Observable<_Power[]> {
    this.powers = [];
    this.http.get<_Power[]>(this.basePowerUrl, this.httpOptions).subscribe(powers=> {
      // this.powers = powers.map(power => this.mapResToPower(power));
      powers.map(power => {
        let p: _Power = this.mapResToPower(power);
        this.powers.push(p);
      });
      // console.log('Powerservice Powers');
      // console.log(this.powers);
    });
    return of(this.powers); 
  }

  getPowerById(id: string): Observable<_Power>{
    this.newPower = null;
    this.http.get<_Power>(this.basePowerUrl + "/" + id, this.httpOptions).subscribe(power => {
      // console.log(power);
      this.newPower = this.mapResToPower(power);
    });
    return of(this.newPower);
  }

  addPower(power:_Power): Observable<_Power> {
    this.http.post<_Power>(this.basePowerUrl, power, this.httpOptions).subscribe(power => {
      console.log(power);
      this.newPower = this.mapResToPower(power);
      console.log(this.newPower);
    }); 
    return of(this.newPower);
  }

  deletePower(id: string): void {
    this.http.delete(this.basePowerUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }

  getPowerInstances(): Observable<_PowerInstance[]> {
    this.powerInstances = [];
    this.http.get<_PowerInstance[]>(this.trappedPowerUrl, this.httpOptions).subscribe(pis => {
      // console.log(pis);
      // this.powerInstances = pis.map(pi => this.mapResToPowerInstance(pi));
      pis.map(pi => {
        let newPI: _PowerInstance = this.mapResToPowerInstance(pi);
        this.powerInstances.push(newPI);
      });
      // console.log("powerService Instances");
      // console.log(this.powerInstances);
    }); 
    return of(this.powerInstances);
  }

  getPowerInstanceById(id: string):Observable<_PowerInstance>{
    this.newPower = null;
    this.http.get<_PowerInstance>(this.trappedPowerUrl + "/" + id, this.httpOptions).subscribe(pi => {
      console.log(pi);
      this.newPowerInstance = this.mapResToPowerInstance(pi);
    });
    return of(this.newPowerInstance);
  }

  addPowerInstance(pi: _PowerInstance): Observable<_PowerInstance> {
    this.newPowerInstance = null;
    console.log(pi);
    this.http.post<_PowerInstance>(this.trappedPowerUrl, pi, this.httpOptions).subscribe(pi => {
      console.log(pi);
      this.newPowerInstance = this.mapResToPowerInstance(pi);
    }); 
    return of(this.newPowerInstance);
  }

  deletePowerInstance(id: string): void {
    this.http.delete(this.trappedPowerUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }
} 