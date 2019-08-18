import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import SavageCharacter from 'src/app/models/Character';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import _Edge from 'src/app/models/Edge';
import _Hindrance from 'src/app/models/Hindrance';
import _Power, { _PowerInstance } from 'src/app/models/Power';
import { CampaignService } from 'src/app/services/campaign.service';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.sass']
})
export class CharacterViewComponent implements OnInit {
  id:string;
  character: SavageCharacter;
  isEdit: boolean;

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private location: Location
    ) { }

  ngOnInit() {
    // console.log(this.route.snapshot.paramMap.get("id"));
    this.id = this.route.snapshot.paramMap.get("id");
    this.characterService.getCharacterByID(this.id).subscribe(character => {
      // console.log(`Character: ${character}`);
      this.character = character
    });
  }

  addEdge() {
    let edge: _Edge = {
      "id": "abc123",
      "type": "Social",
      "name": "Command",
      "description": "You are a leader of men. ",
      "effect": "Extras within 5 inches increase their parry by 1",
      "prerequisites": []
    };
    this.characterService.addEdgeToCharacter(this.character.id, edge).subscribe(
      character => this.character = character
    );
  }

  addHindrance() {
    let hind: _Hindrance = {
      "id": "asdfghjkl",
      "name": "Gravity Sickness",
      "description": "You really prefer solid ground.",
      "major": false,
    };
  
    this.characterService.addHindranceToCharacter(this.character.id, hind).subscribe(
      character => this.character = character
    );
  }

  addPower() {
    let basePower: _Power = {
      "id": "hyperionfly",
      "name": "fly",
      "rank": 40,
      "ruletext": "You can fly around like a bird. Congrats on this achievement"
    };

    let power: _PowerInstance = {
      "id": "hyperionflyjetpack",
      "name": "Jetpack",
      "trapping": "Cybernetic Jet Engines",
      "cost": 4,
      "effect": "for the next minute, you have a fly speed equal to your pace",
      "power": basePower,
      "range": "self",
      "duration": "3 rounds",
      "sustain": "1/round",
      "notes": "You can cast this on an adjacent, willing creature for the same cost"
    };

    this.characterService.addPowerToCharacter(this.character.id, power).subscribe(
      character => this.character = character
    );
  }


  toggleEdit() {
    this.isEdit = !this.isEdit;
  }
}