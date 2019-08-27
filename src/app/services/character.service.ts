import { Injectable } from '@angular/core';
import SavageCharacter, {_SavageCharacter, dbCharacter} from '../models/Character';
import _Race from '../models/Race';
import { Observable, of } from 'rxjs';
import data from '../data/characters.json';
import edges from '../data/edges.json';
import hindrances from '../data/hindrances.json';
import powers from '../data/powers.json';
import _Edge from '../models/Edge';
import _Hindrance from '../models/Hindrance';
import _Power, { _PowerInstance } from '../models/Power';
import {CampaignService} from '../services/campaign.service';
import { HttpClient } from '@angular/common/http';
// import campaigns from '../data/campaigns.json';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  characters:SavageCharacter[];
  newCharacter: SavageCharacter;

  constructor(
    private http: HttpClient,
    private campaignService: CampaignService) 
  { }

  // mapObjectToCharacter(object: dbCharacter): SavageCharacter {
  //   let newchar = new SavageCharacter(object._id, object.name);
  //   newchar.description = object.description;
  //   newchar.traits = object.traits;
  //   newchar.edges = object.edges;
  //   newchar.hindrances = object.hindrances;
  //   newchar.powers = object.powers;
  //   newchar.
  //   return newchar;
  // }

  getCharactersHTTP(): Observable<SavageCharacter[]> {
    this.http.get('/api/characters')
      .subscribe(res => {
        let party = res['characters'];
        for(let i=0; i<party.length; i++){
          let _C: SavageCharacter = new SavageCharacter(
            party[i]["_id"],
            party[i]["name"],
            party[i]["race"]
          );
          this.characters.push(_C);
        } 
      });
    return of(this.characters);
  }

  // postNewCharacter(char: SavageCharacter): Observable<SavageCharacter>{
  //   this.http.post('/api/characters', char)
  //     .subscribe(character => {
  //       this.newCharacter = character
  //     })
  //     return of(this.newCharacter);
  // }

  getCharacters():Observable<SavageCharacter[]>{
    this.campaignService.getCampaigns()
      .subscribe(campaigns => {
        var charArrays = campaigns
          .map(campaign => campaign.party)
          .reduce((acc, val) => acc.concat(val), []);
        this.characters = charArrays;
      })
    // console.log(this.characters);
    
    return of(this.characters);
  }


  getCharacterByID(id:string): Observable<SavageCharacter> {
    if(!this.characters) this.getCharacters();
    return of(this.characters.filter(character => character.id == id)[0]);
  }

  addEdgeToCharacter(id:string, edge:_Edge): Observable<SavageCharacter> {
    let char:SavageCharacter = this.characters.filter(character => character.id === id)[0];
    char.edges.push(edge);

    return of(this.characters.filter(character => character.id === id)[0]);
  }

  addHindranceToCharacter(id:string, hindrance:_Hindrance): Observable<SavageCharacter> {
    let char:SavageCharacter = this.characters.filter(character => character.id === id)[0];
    char.hindrances.push(hindrance);

    return of(this.characters.filter(character => character.id === id)[0]);
  }

  addPowerToCharacter(id:string, power:_PowerInstance): Observable<SavageCharacter> {
    let char: SavageCharacter = this.characters.filter(character => character.id === id)[0];
    char.powers.push(power);

    return of(this.characters.filter(character => character.id === id)[0]);
  }
}
