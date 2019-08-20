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

  getRaces(): Observable<_Race[]> {
    this.http.get<_Race[]>(this.raceUrl, this.httpOptions).subscribe(races => {
      console.log(races);
      this.races = races;
    });
    return of(this.races)
  }

  addRace(race: _Race): Observable<_Race> {
    this.http.post<_Race>(this.raceUrl, race, this.httpOptions).subscribe(race => {
      console.log(race);
      this.newRace = race;
    });
    return of(this.newRace);
  }

  deleteRace(id: string): void {
    this.http.delete(this.raceUrl + "/" + id, this.httpOptions).subscribe(res => {
      console.log(res);
    });
  }
}
