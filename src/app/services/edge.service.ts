import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import _Edge from '../models/Edge';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {
  edges: _Edge[];
  newEdge: _Edge;
  edgeUrl: string;
  httpOptions:Object;

  constructor(private http: HttpClient) {
    this.edges = [];
    this.edgeUrl = "http://localhost:5000/api/edges"; 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem('userToken'))
      })
    };
  }

  mapResToEdge(result: Object): _Edge {
    let E: _Edge = {
      name: result["name"],
      description: result["description"],
      effect: result["effect"],
      type: result["type"],
      id: result["_id"],
      prerequisites: result["prerequisites"],
      initiative_cards: result["initiative_cards"],
      adventure_cards: result["adventure_cards"],
      tactician_cards: result["tactician_cards"]
    };

    return E;
  }

  getEdges():Observable<_Edge[]>{
    this.edges = [];
    this.http.get<_Edge[]>(this.edgeUrl, this.httpOptions).subscribe(edges => {
      // console.log(edges);
      edges.map( edge => {
        let _E = this.mapResToEdge(edge);
        this.edges.push(_E);
      });
    });
    return of(this.edges);
  }

  getEdgeById(id: string):Observable<_Edge>{
    this.newEdge = null;
    this.http.get<_Edge>(this.edgeUrl + "/" + id, this.httpOptions).subscribe(edge => {
      console.log(edge);
      this.newEdge = this.mapResToEdge(edge);
    });
    return of(this.newEdge);
  }

  addEdge(edge:_Edge): Observable<_Edge> {
    this.newEdge = null;
    this.http.post<_Edge>(this.edgeUrl, edge, this.httpOptions).subscribe(edge => {
      console.log(edge);
      this.newEdge = this.mapResToEdge(edge);
    });
    return of(this.newEdge);
  }

  deleteEdge(id: string): void {
    let deleteUrl = this.edgeUrl + '/' + id;
    this.http.delete(deleteUrl).subscribe(res => {
      if(res["success"] === true){
        console.log("successfully deleted edge");
      } else {
        console.log("failed to delete edge");
      }
    });
  } 
}
