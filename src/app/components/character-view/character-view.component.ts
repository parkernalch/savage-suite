import { Component, OnInit, Input } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import SavageCharacter from 'src/app/models/Character';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.sass']
})
export class CharacterViewComponent implements OnInit {
  id:number;
  character: SavageCharacter;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private location: Location
    ) { }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get("id"));
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.characterService.getCharacterByID(this.id).subscribe(character => {
      console.log(character);
      this.character = character
    }
    );
  }

}
