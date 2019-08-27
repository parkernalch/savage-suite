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
    console.log('adding edge (placeholder)');
  }

  addHindrance() {
    console.log('adding hindrance (placeholder');
  }

  addPower() {
    console.log('adding power (placeholder)');
  }


  toggleEdit() {
    this.isEdit = !this.isEdit;
  }
}