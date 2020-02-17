import { Component, OnInit, Input } from '@angular/core';
import SavageCharacter from 'src/app/models/Character';

@Component({
  selector: 'app-character-list-item',
  templateUrl: './character-list-item.component.html',
  styleUrls: ['./character-list-item.component.sass']
})
export class CharacterListItemComponent implements OnInit {
  isEdit: boolean;
  @Input() character: SavageCharacter;

  constructor() { }

  ngOnInit() {
    console.log(this.character);
  }

  toggleEdit(): void {
    this.isEdit = !this.isEdit;
  }

}
