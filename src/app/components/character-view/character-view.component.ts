import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import SavageCharacter from 'src/app/models/Character';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import _Edge from 'src/app/models/Edge';
import _Hindrance from 'src/app/models/Hindrance';
import _Power from 'src/app/models/Power';
import { CampaignService } from 'src/app/services/campaign.service';
import { DOCUMENT } from "@angular/common";
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Component({
  selector: 'app-character-view',
  templateUrl: './character-view.component.html',
  styleUrls: ['./character-view.component.sass']
})
export class CharacterViewComponent implements OnInit {
  id:number;
  character: SavageCharacter;

  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private location: Location
    ) { }

  ngOnInit() {
    // console.log(this.route.snapshot.paramMap.get("id"));
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.characterService.getCharacterByID(this.id).subscribe(character => {
      // console.log(`Character: ${character}`);
      this.character = character
    });
  }

  addEdge() {
    let edge: _Edge = {
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
      "name": "Gravity Sickness",
      "description": "You really prefer solid ground.",
      "major": false,
      "minor": true
    };
  
    this.characterService.addHindranceToCharacter(this.character.id, hind).subscribe(
      character => this.character = character
    );
  }

  addPower() {
    let power: _Power = {
      "name": "Fly",
      "trapping": "Cybernetic Jet Engines",
      "varieties": [
        {
          "name": "Jetpack",
          "cost": 4,
          "effect": "for the next minute, you have a fly speed equal to your pace"
        }
      ]
    };

    this.characterService.addPowerToCharacter(this.character.id, power).subscribe(
      character => this.character = character
    );
  }


  toggleEdit() {
    this.character.isEdit = !this.character.isEdit;
  }
}