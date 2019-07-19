import { Component, OnInit, Input } from '@angular/core';
import _Hindrance from 'src/app/models/Hindrance';

@Component({
  selector: 'app-cview-hindrance',
  templateUrl: './cview-hindrance.component.html',
  styleUrls: ['./cview-hindrance.component.sass']
})
export class CviewHindranceComponent implements OnInit {
  @Input() hindrance: _Hindrance;

  constructor() { }

  ngOnInit() {
  }

}
