import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitiativeComponent } from './components/initiative/initiative.component';
import { CampaignManagerComponent } from './components/campaign-manager/campaign-manager.component';
import { EncounterBuilderComponent } from './components/encounter-builder/encounter-builder.component';
import { CharacterVaultComponent } from './components/character-vault/character-vault.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CharacterViewComponent } from './components/character-view/character-view.component';
import { CampaignViewComponent } from './components/campaign-view/campaign-view.component';
import { AddCustomContentComponent } from './components/add-custom-content/add-custom-content.component';
import { NewCharFormComponent } from './components/new-char-form/new-char-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { HandoutComponent } from './components/handout/handout.component';

const routes: Routes = [
  {path: '', component:HomepageComponent},
  {path: 'home', component:HomepageComponent},
  {path: 'campaign', component:CampaignManagerComponent},
  {path: 'campaign/:id', component:CampaignViewComponent}, 
  {path: 'campaign/handout/:id', component:HandoutComponent}, 
  {path: 'characters', component: CharacterVaultComponent},
  {path: 'characters/:id', component:CharacterViewComponent},
  {path: 'new/character', component: NewCharFormComponent},
  {path: 'account', component:ProfileComponent},
  {path: 'subscriptions', component:SubscriptionComponent}
  // {path: 'initiative', component:InitiativeComponent},
  // {path: 'encounter', component: EncounterBuilderComponent},
  // {path: 'custom', component: AddCustomContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
