import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attribute-die',
  templateUrl: './attribute-die.component.html',
  styleUrls: ['./attribute-die.component.sass']
})
export class AttributeDieComponent implements OnInit {
  @Input() attribute: string;
  @Input() value: string;

  constructor() { }

  ngOnInit() {
    // console.log(`Attribute ${this.attribute}: ${this.value}`);
  }

}
