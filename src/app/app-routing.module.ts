import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitiativeComponent } from './components/initiative/initiative.component';
import { CampaignManagerComponent } from './components/campaign-manager/campaign-manager.component';
import { EncounterBuilderComponent } from './components/encounter-builder/encounter-builder.component';
import { CharacterVaultComponent } from './components/character-vault/character-vault.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CharacterViewComponent } from './components/character-view/character-view.component';


const routes: Routes = [
  {path: '', component:HomepageComponent},
  {path: 'initiative', component:InitiativeComponent},
  {path: 'campaign', component:CampaignManagerComponent},
  {path: 'characters/:id', component:CharacterViewComponent},
  {path: 'encounter', component: EncounterBuilderComponent},
  {path: 'characters', component: CharacterVaultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
