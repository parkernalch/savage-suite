import { Component, OnInit } from '@angular/core';
import SavageCharacter from 'src/app/models/Character';
import _Race from 'src/app/models/Race';

@Component({
  selector: 'app-character-modal',
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.sass']
})
export class CharacterModalComponent implements OnInit {
  isVisible:boolean = false;
  characterData:SavageCharacter;

  constructor() {
  }

  ngOnInit() {
    let Human: _Race = {
      name: 'Human',
      description: "Classic fantasy human",
      features: []
    }

    let C = new SavageCharacter('Hector Barrelwaite', Human);
    this.characterData = C;
  }

}
