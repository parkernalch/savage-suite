import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import _Race from 'src/app/models/Race';
import _Edge from 'src/app/models/Edge';
import _Hindrance from 'src/app/models/Hindrance';
import _Power from 'src/app/models/Power';
import { RaceService } from 'src/app/services/race.service';
import { EdgeService } from 'src/app/services/edge.service';
import { HindranceService } from 'src/app/services/hindrance.service';
import { PowerService } from 'src/app/services/power.service';
import _Skill from 'src/app/models/Skill';
import _Attribute from 'src/app/models/Attribute';

@Component({
  selector: 'app-new-char-form',
  templateUrl: './new-char-form.component.html',
  styleUrls: ['./new-char-form.component.sass']
})
export class NewCharFormComponent implements OnInit {
  allRaces: _Race[];
  viewRace: _Race;
  CRace: _Race;
  @ViewChild('racePicker', {static: true})
  racePicker: ElementRef<HTMLSelectElement>;

  allHindrances: _Hindrance[];
  hindranceFilter: boolean;
  filteredHindrances: _Hindrance[];
  viewHindrance: _Hindrance;
  CHindrances: _Hindrance[];
  @ViewChild('hindrancePicker', {static: true})
  hindrancePicker: ElementRef<HTMLSelectElement>;

  allEdges: _Edge[];
  viewEdge: _Edge;
  CEdges: _Edge[]; 
  @ViewChild('edgePicker', {static: true})
  edgePicker: ElementRef<HTMLSelectElement>;


  CAttributes: _Attribute[];
  attributePoints: number;

  CSkills: _Skill[];
  skillPoints: number;

  allPowers: _Power[];
  viewPower: _Power;
  CPowers: _Power[];

  constructor(
    private raceService: RaceService,
    private edgeService: EdgeService,
    private hindranceService: HindranceService,
    private powerService: PowerService
  ) { }

  ngOnInit() {
    this.raceService.getRaces().subscribe(races => this.allRaces = races);
    this.edgeService.getEdges().subscribe(edges => this.allEdges = edges);
    this.hindranceService.getHindrances().subscribe(hindrances => this.allHindrances = hindrances);
    this.powerService.getPowers().subscribe(powers => this.allPowers = powers);
    this.hindranceFilter = false;
    this.CAttributes = [
      { name: 'Agility', level: 4, modifier: 0 },
      { name: 'Smarts', level: 4, modifier: 0 },
      { name: 'Spirit', level: 4, modifier: 0 },
      { name: 'Strength', level: 4, modifier: 0 },
      { name: 'Vigor', level: 4, modifier: 0 }
    ];
    this.CSkills = [
      { name: 'Athletics', linked_attribute: 'Agility', level: 4, modifier: 0, trained: 1},
      { name: 'Common Knowledge', linked_attribute: 'Smarts', level: 4, modifier: 0, trained: 1},
      { name: 'Notice', linked_attribute: 'Smarts', level: 4, modifier: 0, trained: 1},
      { name: 'Persuasion', linked_attribute: 'Spirit', level: 4, modifier: 0, trained: 1},
      { name: 'Stealth', linked_attribute: 'Agility', level: 4, modifier: 0, trained: 1} 
    ]
    this.attributePoints = 5;
    this.skillPoints = 15;
  }
  ngAfterViewInit(){}

  populateRaceViewer(){
    let rname = this.racePicker.nativeElement.value;
    this.viewRace = this.allRaces.filter(race => race.name === rname)[0]; 
    console.log(this.viewRace);
  }
  populateHindranceViewer(){
    let hname = this.hindrancePicker.nativeElement.value.split(' | ')[0];
    console.log(hname);
    this.viewHindrance = this.allHindrances.filter(hind => hind.name === hname)[0];
    console.log(this.viewHindrance);
  }
  populateEdgeViewer(){
    let ename = this.edgePicker.nativeElement.value;
    this.viewEdge = this.allEdges.filter(edge => edge.name === ename)[0];
  }

  modifyAttribute(attribute:_Attribute, type: string){
    if(type === "+" && attribute.level <= 10 && this.attributePoints > 0){
      attribute.level += 2;
      this.attributePoints -= 1;
    } else if (type === "-" && attribute.level >= 6 && this.attributePoints < 5) {
      attribute.level -= 2;
      this.attributePoints += 1;
    }
  }

}
