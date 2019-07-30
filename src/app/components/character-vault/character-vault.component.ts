import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import SavageCharacter from 'src/app/models/Character';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-character-vault',
  templateUrl: './character-vault.component.html',
  styleUrls: ['./character-vault.component.sass']
})
export class CharacterVaultComponent implements OnInit {
  characters: SavageCharacter[];

  constructor(
    private campaignService: CampaignService,
    private characterService:CharacterService) { }

  ngOnInit() {
    this.getCharacters();
  }

  getCharacters(): void {
    this.characterService.getCharacters()
      .subscribe(characters => {
        this.characters = characters;
      }); 
 }

  toggleEdit(character:SavageCharacter): void {
    console.log(character);
    character.toggleEdit();
  }

  filterCharacters($event:KeyboardEvent): void {
    // console.log(document.getElementById("filterfield").value);
    let val:string = (<HTMLInputElement>document.getElementById('filterfield')).value.toLowerCase();
    let pattern:RegExp = new RegExp(`${val}`);
    this.getCharacters();
    this.characters = this.characters.filter(character => pattern.test(character.campaign.toLowerCase() + character.name.toLowerCase()));
    // return this.characters.filter(character => pattern.test(character.name.toLowerCase()));
  }

}
