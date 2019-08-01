import { Component, OnInit, Input } from '@angular/core';
import SavageCharacter from 'src/app/models/Character';
import _Skill from 'src/app/models/Skill';

@Component({
  selector: 'app-attribute-table',
  templateUrl: './attribute-table.component.html',
  styleUrls: ['./attribute-table.component.sass']
})
export class AttributeTableComponent implements OnInit {
  @Input() character: SavageCharacter;
  viewHindrances: boolean = true;
  viewEdges: boolean = false;
  viewPowers: boolean = false;
  viewSkills: boolean = false;
  viewGear: boolean = false;

  views: boolean[] = [this.viewHindrances, this.viewEdges, this.viewPowers, this.viewSkills, this.viewGear];

  constructor() { }

  ngOnInit() {
    // console.log(this.character);
  }

  rollSkill(skill: _Skill): number {
    var result: number = Math.floor(Math.random() * skill.level) + 1 + skill.modifier;
    console.log(result);
    return result;
  }

  increaseSkill(skill: _Skill): void {
    let charSkill = this.character.traits.skills.filter(s => s.name === skill.name)[0];
    if(charSkill.level <= 10){
      charSkill.level += 2;
      charSkill.modifier = 0;
    } else if(charSkill.level === 12 && charSkill.modifier < 4 ){
      charSkill.modifier += 1;
    }
    // console.log(charSkill);
  }

  decreaseSkill(skill: _Skill): void {
    let charSkill = this.character.traits.skills.filter(s => s.name === skill.name)[0];
    if(charSkill.level > 4 && charSkill.level <= 12 && charSkill.modifier === 0){
      charSkill.level -= 2;
      charSkill.modifier = 0;
    } else if( charSkill.level === 12 && charSkill.modifier > 0){
      charSkill.modifier -= 1;
    }
    // console.log(charSkill);
  }

  toggleView(view:string): void {
    switch(view){
      case "hindrances":
        this.viewHindrances = true;
        this.viewEdges = false;
        this.viewPowers = false;
        this.viewSkills = false;
        this.viewGear = false;
        break;
      case "edges":
        this.viewHindrances = false;
        this.viewEdges = true;
        this.viewPowers = false;
        this.viewSkills = false;
        this.viewGear = false;
        break;
      case "powers":
        this.viewHindrances = false;
        this.viewEdges = false;
        this.viewPowers = true;
        this.viewSkills = false;
        this.viewGear = false;
        break;
      case "skills":
        this.viewHindrances = false;
        this.viewEdges = false;
        this.viewPowers = false;
        this.viewSkills = true;
        this.viewGear = false;
        break;
      case "gear":
        this.viewHindrances = false;
        this.viewEdges = false;
        this.viewPowers = false;
        this.viewSkills = false;
        this.viewGear = true;
        break;
      default:
        break;
    }
  }
}
