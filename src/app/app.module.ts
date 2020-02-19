import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CharacterVaultComponent } from './components/character-vault/character-vault.component';
import { CampaignManagerComponent } from './components/campaign-manager/campaign-manager.component';
import { EncounterBuilderComponent } from './components/encounter-builder/encounter-builder.component';
import { InitiativeComponent } from './components/initiative/initiative.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { CharacterModalComponent } from './components/character-modal/character-modal.component';
import { CharacterListItemComponent } from './components/character-list-item/character-list-item.component';
import { CharacterViewComponent } from './components/character-view/character-view.component';
import { CviewEdgeComponent } from './components/cview-edge/cview-edge.component';
import { CviewHindranceComponent } from './components/cview-hindrance/cview-hindrance.component';
import { CviewPowerComponent } from './components/cview-power/cview-power.component';
import { CampaignViewComponent } from './components/campaign-view/campaign-view.component';
import { AttributeTableComponent } from './components/attribute-table/attribute-table.component';
import { AttributeDieComponent } from './components/attribute-die/attribute-die.component';
import { AddCustomContentComponent } from './components/add-custom-content/add-custom-content.component';
import { NewCharFormComponent } from './components/new-char-form/new-char-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { HandoutComponent } from './components/handout/handout.component';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { MessageComponent } from './components/message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    CharacterVaultComponent,
    CampaignManagerComponent,
    EncounterBuilderComponent,
    InitiativeComponent,
    HeaderComponent,
    HomepageComponent,
    FooterComponent,
    CharacterModalComponent,
    CharacterListItemComponent,
    CharacterViewComponent,
    CviewEdgeComponent,
    CviewHindranceComponent,
    CviewPowerComponent,
    CampaignViewComponent,
    AttributeTableComponent,
    AttributeDieComponent,
    AddCustomContentComponent,
    NewCharFormComponent,
    ProfileComponent,
    SubscriptionComponent,
    HandoutComponent,
    CampaignListComponent,
    MessageComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
