import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import SavageCharacter from 'src/app/models/Character';

@Component({
  selector: 'app-character-vault',
  templateUrl: './character-vault.component.html',
  styleUrls: ['./character-vault.component.sass']
})
export class CharacterVaultComponent implements OnInit {
  characters: SavageCharacter[];

  constructor(private characterService:CharacterService) { }

  ngOnInit() {
    this.getCharacters();
  }

  getCharacters(): void {
    this.characterService.getCharacters()
      .subscribe(characters => {
        console.log(characters);
        this.characters = characters;
      }); 
  }
}
