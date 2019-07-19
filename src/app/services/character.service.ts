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

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  characters:SavageCharacter[] = [];

  constructor() { 
    let Human:_Race = {
      name: 'Human',
      description: 'Classic humans',
      features: []
    }

    let Edges:_Edge[] = [];
    for(let e=0; e<edges.length; e++){
      let edge: _Edge = {
        "name": edges[e].name,
        "description": edges[e].description,
        "effect": edges[e].effect,
        "prerequisites": edges[e].prerequisites
      };

      Edges.push(edge);
    }

    let Hindrances:_Hindrance[] = [];
    for(let h=0; h<hindrances.length; h++){
      let hindrance:_Hindrance = {
        "name": hindrances[h].name,
        "description": hindrances[h].description,
        "major": hindrances[h].major,
        "minor": hindrances[h].minor
      };

      Hindrances.push(hindrance);
    }
    
    let Powers: _Power[] = [];
    for(let p=0; p<powers.length; p++){
      let power:_Power = {
        "name": powers[p].name,
        "trapping": powers[p].trapping,
        "varities": powers[p].varieties
      };

      Powers.push(power);
    }

    for(let i=0; i<data.charlist.length; i++){
      let C:SavageCharacter = new SavageCharacter(i, data.charlist[i].name, Human);
      if(i==7) C.isEdit = true;
      C.description = data.charlist[i].description;
      C.campaign = data.charlist[i].campaign;

      // Add Edges
      let edgeCount = Math.floor(Math.random() * 3);
      for(let ec=0; ec<edgeCount; ec++){
        C.edges.push(Edges[Math.floor(Math.random() * Edges.length)]);
      }

      // Add Hindrances
      let hindCount = Math.floor(Math.random() * 4);
      for(let hc=0; hc<hindCount; hc++){
        C.hindrances.push(Hindrances[Math.floor(Math.random() * Hindrances.length)]);
      }

      // Add Powers
      let powerCount = Math.floor(Math.random() * 5);
      for(let pc=0; pc<powerCount; pc++){
        C.powers.push(Powers[Math.floor(Math.random() * Powers.length)]);
      }

      this.characters.push(C);
    }
  }

  getCharacters():Observable<SavageCharacter[]>{
    console.log(this.characters);
    return of(this.characters);
  }

  getCharacterByID(id:number): Observable<SavageCharacter> {
    return of(this.characters.filter(character => character.id == id)[0]);
  }
}
