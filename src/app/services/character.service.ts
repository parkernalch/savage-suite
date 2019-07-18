import { Injectable } from '@angular/core';
import SavageCharacter, {_SavageCharacter} from '../models/Character';
import _Race from '../models/Race';
import { Observable, of } from 'rxjs';
import data from '../data/characters.json'
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

    for(let i=0; i<data.charlist.length; i++){
      let C:SavageCharacter = new SavageCharacter(data.charlist[i].name, Human);
      if(i==7) C.isEdit = true;
      C.description = data.charlist[i].description;
      C.campaign = data.charlist[i].campaign;
      this.characters.push(C);
    }
  }

  getCharacters():Observable<SavageCharacter[]>{
    return of(this.characters);
  }
}
