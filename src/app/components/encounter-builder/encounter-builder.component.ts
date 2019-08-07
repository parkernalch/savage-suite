import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { _SavageCharacter } from 'src/app/models/Character';
import Encounter from 'src/app/models/Encounter';
import _Campaign from 'src/app/models/Campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-encounter-builder',
  templateUrl: './encounter-builder.component.html',
  styleUrls: ['./encounter-builder.component.sass']
})
export class EncounterBuilderComponent implements OnInit {
  combatants: _SavageCharacter[];
  encounter: Encounter;
  campaigns: _Campaign[];
  selectedCampaign: _Campaign;
  quickAddChars: _SavageCharacter[];

  @ViewChild('campaignPicker', {static:true})
  campaignPicker: ElementRef<HTMLSelectElement>;
  // encounterService can load saved instances
  constructor(
    private campaignService: CampaignService,
    private characterService: CharacterService) { }

  ngOnInit() {
    this.campaignService.getCampaigns()
      .subscribe(campaigns => {
        this.campaigns = campaigns;
    });
  }

  ngAfterViewInit() {
    console.log(this.quickAddChars);
  }

  setCampaign():void {
    this.selectedCampaign = this.campaigns.find(campaign => campaign.name === this.campaignPicker.nativeElement.value);
    this.quickAddChars = this.selectedCampaign.party;
  }

}