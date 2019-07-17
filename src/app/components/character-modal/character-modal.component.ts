import { Component, OnInit, Input } from '@angular/core';
import SavageCharacter from 'src/app/models/Character';
import _Race from 'src/app/models/Race';

@Component({
  selector: 'app-character-modal',
  templateUrl: './character-modal.component.html',
  styleUrls: ['./character-modal.component.sass']
})
export class CharacterModalComponent implements OnInit {
  isVisible:boolean = false;
  @Input() characterData: SavageCharacter;

  constructor() {
  }

  ngOnInit() {
  }

}
