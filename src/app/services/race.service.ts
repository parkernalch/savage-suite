import { Injectable } from '@angular/core';
import _Race from '../models/Race';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  races: _Race[];
  newRace: _Race;
  raceUrl: string;
  httpOptions: Object;

  constructor(private http: HttpClient) {
    this.raceUrl = "http://localhost:5000/api/races";
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem('userToken'))
      })
    };
  }

  mapResToRace(result: Object):_Race{
    let _R:_Race = {
      id: result["_id"],
      name: result["name"],
      description: result["description"],
      features: result["features"],
      base_stats: {
        agility: result["base_stats"]["agility"],
        smarts: result["base_stats"]["smarts"],
        spirit: result["base_stats"]["spirit"],
        strength: result["base_stats"]["strength"],
        vigor: result["base_stats"]["vigor"]
      } 
    };
    return _R; 
  }

  getRaces(): Observable<_Race[]> {
    this.races = [];
    this.http.get<_Race[]>(this.raceUrl, this.httpOptions).subscribe(races => {
      console.log(races);
      this.races = races.map(race => this.mapResToRace(race));
    });
    return of(this.races)
  }

  getRaceById(id: string): Observable<_Race> {
    this.newRace = null;
    this.http.get<_Race>(this.raceUrl + "/" + id, this.httpOptions).subscribe(race => {
      console.log(race);
      this.newRace = this.mapResToRace(race);
    });
    return of(this.newRace);
  }

  addRace(race: _Race): Observable<_Race> {
    this.newRace = null;
    this.http.post<_Race>(this.raceUrl, race, this.httpOptions).subscribe(race => {
      console.log(race);
      this.newRace = this.mapResToRace(race);
    });
    return of(this.newRace);
  }

  deleteRace(id: string): void {
    this.http.delete(this.raceUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }
}
