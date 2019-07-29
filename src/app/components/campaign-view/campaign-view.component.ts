import { Component, OnInit, Input } from '@angular/core';
import _Campaign from 'src/app/models/Campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.sass']
})
export class CampaignViewComponent implements OnInit {
  @Input() campaign: _Campaign;
  id: number;

  constructor(
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private location: Location
    ) { }

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get("id"));
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.campaignService.getCampaignByID(this.id).subscribe(campaign => {
      console.log(campaign);
      this.campaign = campaign
    });
  }

}
