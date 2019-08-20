import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import _Edge from 'src/app/models/Edge';
import _Hindrance from 'src/app/models/Hindrance';
import _Power, { _PowerInstance } from 'src/app/models/Power';
import SavageCharacter from 'src/app/models/Character';
import _Race from 'src/app/models/Race';
import { _User } from 'src/app/models/User';
import _Item from 'src/app/models/Item';
import _Attribute from 'src/app/models/Attribute';
import _Campaign from 'src/app/models/Campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { EdgeService } from 'src/app/services/edge.service';
import { HindranceService } from 'src/app/services/hindrance.service';
import { PowerService } from 'src/app/services/power.service';
import { RaceService } from 'src/app/services/race.service';

@Component({
  selector: 'app-add-custom-content',
  templateUrl: './add-custom-content.component.html',
  styleUrls: ['./add-custom-content.component.sass']
})
export class AddCustomContentComponent implements OnInit {
  campaigns: _Campaign[];
  selectedCampaign: _Campaign;

  addEdge: boolean;
  edges: _Edge[];
  edge:_Edge;
  edgePrerequisite: string;

  addHindrance: boolean;
  hindrances: _Hindrance[];
  hindrance: _Hindrance;

  addPower: boolean;
  power: _Power;
  powers: _Power[];

  addPowerInstance: boolean;
  powerInstance: _PowerInstance;

  addCharacter: boolean;
  character: SavageCharacter;
  characterAgility:number;
  characterSmarts:number;
  characterSpirit:number;
  characterStrength:number;
  characterVigor:number;

  addRace: boolean;
  race: _Race;
  races: _Race[];
  
  addUser: boolean;
  user: _User;

  addItem: boolean;
  item: _Item;

  constructor(
    private edgeService: EdgeService,
    private hindranceService: HindranceService,
    private campaignService: CampaignService,
    private powerService: PowerService,
    private raceService: RaceService,
    private http: HttpClient
    ) { 
    this.addEdge = true;
    this.addHindrance = false;
    this.addPower = false;
    this.addPowerInstance = false;
    this.addCharacter = false;
    this.addRace = false;
    this.addUser = false;
    this.addItem = false;
  }

  ngOnInit() {
    this.campaignService.getCampaigns()
      .subscribe(campaigns => this.campaigns = campaigns);
    this.selectedCampaign = this.campaigns[0];

    this.edgeService.getEdges()
      .subscribe(edges => {
        // console.log(edges);
        this.edges = edges
        console.log(this.edges);
      });

    this.hindranceService.getHindrances()
      .subscribe(hindrances => {
        this.hindrances = hindrances;
        console.log(this.hindrances);
      }); 

    this.raceService.getRaces()
      .subscribe(races => {
        this.races = races;
        console.log(this.races);
      });

    this.powerService.getPowers()
      .subscribe(powers => {
        this.powers = powers;
        console.log(this.powers);
      });

    

    this.edge = { 
      id: null,
      name: null,
      type: null,
      description: null,
      effect: null,
      prerequisites: [],
      initiative_cards: 0,
      tactician_cards: 0,
      adventure_cards: 0
    };

    this.hindrance = {
      id: null,
      name: null,
      description: null,
      major: false
    };

    this.power = {
      id: null,
      name: null,
      ruletext: null,
      rank: 0
    };

    this.powerInstance = {
      id: null,
      name: null,
      trapping: null,
      cost: 0,
      effect: null,
      power: null,
      range: null,
      duration: null,
      sustain: null,
      notes: null
    };

    this.character = new SavageCharacter(null, null, null);

    this.race = {
      id: null,
      name: null,
      description: null,
      features: [],
      base_stats: {
        agility: 0,
        smarts: 0,
        spirit: 0,
        strength: 0,
        vigor: 0
      }
    };

    this.user = {
      id: null,
      name: null,
      username: null,
      email: null,
      role: null,
      register_date: null
    };
    this.user.register_date = new Date(Date.now());

    this.item = new _Item('mundane', null, 0, 0, null, {addtl: null}); 
  }

  toggleAddEdge() {
    this.addEdge = !this.addEdge;
  }
  postNewEdge(event) { 
    event.preventDefault();
    console.log("Posting Edge...");
    this.edge.prerequisites = [... this.edgePrerequisite.split(',')];
    // console.log(this.edge);
    this.edgeService.addEdge(this.edge).subscribe(edge => {
      if(edge){
        this.edges = [... this.edges, edge];
      }
      console.log(this.edges); 
    });
  }

  toggleAddHindrance() {
    this.addHindrance = !this.addHindrance;
  }
  postNewHindrance(event){
    event.preventDefault();
    console.log(this.hindrance); 
    this.hindranceService.addHindrance(this.hindrance);
  }

  toggleAddPower() {
    this.addPower = !this.addPower;
  }
  postNewPower(event) {
    event.preventDefault();
    console.log(this.power);
  }

  toggleAddPowerInstance() {
    this.addPowerInstance = !this.addPowerInstance;
  }
  postNewPowerInstance(event){
    event.preventDefault();
    console.log(this.powerInstance);
  }

  toggleAddCharacter() {
    this.addCharacter = !this.addCharacter;
  }
  postNewCharacter(event){
    event.preventDefault();
    let agility:_Attribute = {
      name: "agility",
      level: this.characterAgility,
      modifier: 0
    };
    let smarts:_Attribute = {
      name: "smarts",
      level: this.characterSmarts,
      modifier: 0
    };
    let spirit:_Attribute = {
      name: "spirit",
      level: this.characterSpirit,
      modifier: 0
    };
    let strength:_Attribute = {
      name: "strength",
      level: this.characterStrength,
      modifier: 0
    };
    let vigor:_Attribute = {
      name: "vigor",
      level: this.characterVigor,
      modifier: 0
    };
    this.character.traits.attributes = [
      agility,
      smarts,
      spirit,
      strength,
      vigor
    ];
    // this.character.campaign = this.selectedCampaign;
    console.log(this.character);
  }

  toggleAddRace() {
    this.addRace = !this.addRace;
  }
  postNewRace(event){
    event.preventDefault();
    console.log(this.race);
  }

  toggleAddUser() {
    this.addUser = !this.addUser;
  }
  postNewUser(event){
    event.preventDefault();
    console.log(this.user);
  }

  toggleAddItem() {
    this.addItem = !this.addItem;
  } 
  postNewItem(event){
    event.preventDefault();
    console.log(this.item);
  }
}
