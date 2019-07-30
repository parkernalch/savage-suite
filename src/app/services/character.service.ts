import { Injectable } from '@angular/core';
import SavageCharacter, {_SavageCharacter} from '../models/Character';
import _Race from '../models/Race';
import { Observable, of } from 'rxjs';
import data from '../data/characters.json';
import edges from '../data/edges.json';
import hindrances from '../data/hindrances.json';
import powers from '../data/powers.json';
import _Edge from '../models/Edge';
import _Hindrance from '../models/Hindrance';
import _Power from '../models/Power';
import {CampaignService} from '../services/campaign.service';
// import campaigns from '../data/campaigns.json';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  characters:SavageCharacter[];

  constructor(private campaignService: CampaignService) { }

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

  getCharacterByID(id:number): Observable<SavageCharacter> {
    if(!this.characters) this.getCharacters();
    return of(this.characters.filter(character => character.id == id)[0]);
  }

  addEdgeToCharacter(id:number, edge:_Edge): Observable<SavageCharacter> {
    let char:SavageCharacter = this.characters.filter(character => character.id === id)[0];
    char.edges.push(edge);

    return of(this.characters.filter(character => character.id === id)[0]);
  }

  addHindranceToCharacter(id:number, hindrance:_Hindrance): Observable<SavageCharacter> {
    let char:SavageCharacter = this.characters.filter(character => character.id === id)[0];
    char.hindrances.push(hindrance);

    return of(this.characters.filter(character => character.id === id)[0]);
  }

  addPowerToCharacter(id:number, power:_Power): Observable<SavageCharacter> {
    let char: SavageCharacter = this.characters.filter(character => character.id === id)[0];
    char.powers.push(power);

    return of(this.characters.filter(character => character.id === id)[0]);
  }
}
