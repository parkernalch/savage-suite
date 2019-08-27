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
import { Subscription } from 'rxjs';

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
  displayEdge: _Edge;
  edgePrerequisite: string;

  addHindrance: boolean;
  hindrances: _Hindrance[];
  hindrance: _Hindrance;
  displayHindrance: _Hindrance;

  addPower: boolean;
  power: _Power;
  powers: _Power[];
  displayPower: _Power;

  addPowerInstance: boolean;
  powerInstance: _PowerInstance;
  powerInstances: _PowerInstance[];
  displayPowerInstance: _PowerInstance;

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
  raceFeatures: _Edge[];
  raceFeat: string;
  displayRace: _Race;
  
  addUser: boolean;
  user: _User;

  addItem: boolean;
  item: _Item;

  Subscriptions: Subscription[];

  constructor(
    private edgeService: EdgeService,
    private hindranceService: HindranceService,
    private campaignService: CampaignService,
    private powerService: PowerService,
    private raceService: RaceService,
    private http: HttpClient
    ) { 
    this.addEdge = false;
    this.addHindrance = false;
    this.addPower = false;
    this.addPowerInstance = false;
    this.addCharacter = false;
    this.addRace = false;
    this.addUser = false;
    this.addItem = false;

    this.raceFeat = null;
    this.raceFeatures = [];
    
    this.Subscriptions = [];
  }

  ngOnInit() {
    this.Subscriptions.push(this.edgeService.getEdges()
      .subscribe(edges => {
        this.edges = edges;
        console.log("Edges:", this.edges);
      }));

    this.Subscriptions.push(this.hindranceService.getHindrances()
      .subscribe(hindrances => {
        this.hindrances = hindrances;
        console.log("Hindrances:", this.hindrances);
      })); 

    this.Subscriptions.push(this.raceService.getRaces()
      .subscribe(races => {
        this.races = races;
        console.log("Races:", this.races);
      }));

    this.Subscriptions.push(this.powerService.getPowers()
      .subscribe(powers => {
        this.powers = powers;
        console.log("Powers:", this.powers);
      }));

    this.Subscriptions.push(this.powerService.getPowerInstances()
      .subscribe(powers => {
        this.powerInstances = powers;
        console.log("Power Costs", this.powerInstances);
      }));

    this.edge = { 
      id: null,
      name: null,
      type: null,
      description: null,
      effect: null,
      prerequisites: [],
      initiative_cards: 0,
      tactician_cards: 0,
      adventure_cards: 0,
      rank: 0,
      creator: null
    };

    this.hindrance = {
      id: null,
      type: null,
      name: null,
      description: null,
      major: false,
      creator: null
    };

    this.power = {
      id: null,
      name: null,
      effect: null,
      ruletext: null,
      rank: 0,
      cost: 0,
      range: null,
      duration: null,
      modifiers: [],
      creator: null
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
      notes: null,
      creator: null
    };

    this.character = new SavageCharacter(null, null, null);

    this.race = {
      id: null,
      name: null,
      description: null,
      features: [],
      hindrances: [],
      base_stats: {
        agility: 0,
        smarts: 0,
        spirit: 0,
        strength: 0,
        vigor: 0
      },
      creator: null
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

  ngAfterViewInit(){
    console.log('unsubscribing from GETs');
    this.Subscriptions.forEach(sub => sub.unsubscribe);
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
    this.powerService.addPower(this.power).subscribe(power => {
      console.log(power);
      if(power && this.powers.length === 0){
        this.powers.push(power);
      } else if(power && this.powers.length > 0) {
        this.powers = [... this.powers, power];
      } else {
        console.log('Power is missing');
      }
    });
  }

  toggleAddPowerInstance() {
    this.addPowerInstance = !this.addPowerInstance;
  }
  postNewPowerInstance(event){
    event.preventDefault();
    let _P: _Power; 
    console.log(this.powerInstance); 
    this.powerService.addPowerInstance(this.powerInstance).subscribe(pi => {
      console.log(pi);
      if(pi && this.powerInstances.length === 0){
        this.powerInstances.push(pi);
      } else if (pi && this.powerInstances.length > 0){
        this.powerInstances = [... this.powerInstances, pi];
      } else {
        console.log('Power Instance Missing');
      }
    });
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
  addRaceFeature(e:Event){
    let rf: _Edge = this.edges.filter(edge => edge.id === this.raceFeat)[0];
    this.race.features.push(rf);
  }
  tryRemoveRaceFeat(id: string){
    this.race.features = this.race.features.filter(feat => feat.id !== id);
  }
  postNewRace(event){
    event.preventDefault();
    console.log(this.race);
    this.raceService.addRace(this.race).subscribe(race => {
      console.log(race);
      if(race && this.races.length === 0){
        this.races.push(race);
      } else if (race && this.races.length > 0){
        this.races = [... this.races, race];
      } else {
        console.log("Race Missing");
      }
    });
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
