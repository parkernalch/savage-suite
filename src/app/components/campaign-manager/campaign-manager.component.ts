import { Component, OnInit } from '@angular/core';
import _Campaign from 'src/app/models/Campaign';
import { CampaignService } from 'src/app/services/campaign.service';


@Component({
  selector: 'app-campaign-manager',
  templateUrl: './campaign-manager.component.html',
  styleUrls: ['./campaign-manager.component.sass']
})
export class CampaignManagerComponent implements OnInit {
  campaigns: _Campaign[];

  constructor(private campaignService: CampaignService){ }

  ngOnInit() {
    this.getCampaigns();
  }

  getCampaigns(): void {
    this.campaignService.getCampaigns()
      .subscribe(campaigns => {
        this.campaigns = campaigns;
        console.log(this.campaigns);
      });
  }

}
