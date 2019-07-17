import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterVaultComponent } from './components/character-vault/character-vault.component';
import { CampaignManagerComponent } from './components/campaign-manager/campaign-manager.component';
import { EncounterBuilderComponent } from './components/encounter-builder/encounter-builder.component';
import { InitiativeComponent } from './components/initiative/initiative.component';
import { HeaderComponent } from './components/layout/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterVaultComponent,
    CampaignManagerComponent,
    EncounterBuilderComponent,
    InitiativeComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
