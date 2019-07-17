import { Injectable } from '@angular/core';
import SavageCharacter, {_SavageCharacter} from '../models/Character';
import _Race from '../models/Race';
import { Observable, of } from 'rxjs';

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

    for(let i=0; i<10; i++){
      let C:SavageCharacter = new SavageCharacter(`Character${i}`, Human);
      if(i==7) C.isEdit = true;
      this.characters.push(C);
    }
  }

  getCharacters():Observable<SavageCharacter[]>{
    return of(this.characters);
  }
}
