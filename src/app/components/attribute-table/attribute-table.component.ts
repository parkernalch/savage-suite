import { Component, OnInit, Input } from '@angular/core';
import SavageCharacter from 'src/app/models/Character';

@Component({
  selector: 'app-attribute-table',
  templateUrl: './attribute-table.component.html',
  styleUrls: ['./attribute-table.component.sass']
})
export class AttributeTableComponent implements OnInit {
  @Input() character: SavageCharacter;
  
  constructor() { }

  ngOnInit() {
    // console.log(this.character);
  }

}
