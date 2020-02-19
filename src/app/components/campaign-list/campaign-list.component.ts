import { Component, OnInit, Input } from '@angular/core';
import _Campaign from 'src/app/models/Campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.sass']
})
export class CampaignListComponent implements OnInit {
  campaigns: _Campaign[];

  constructor(
    private campaignService: CampaignService,
    private router:Router
    ){ }

  ngOnInit() {
    this.getCampaigns();
  }
  
  getCampaigns(): void {
    this.campaignService.getCampaigns()
      .subscribe(campaigns => {
        console.log(campaigns);
        this.campaigns = campaigns;
        console.log(this.campaigns);
      });
  }

  LaunchCampaignView(id:number):void{
    this.router.navigate([`campaign/${id}`])
  }

}
