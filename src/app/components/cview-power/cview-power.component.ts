import { Component, OnInit, Input } from '@angular/core';
import _Power from 'src/app/models/Power';

@Component({
  selector: 'app-cview-power',
  templateUrl: './cview-power.component.html',
  styleUrls: ['./cview-power.component.sass']
})
export class CviewPowerComponent implements OnInit {
  @Input() power: _Power;
  constructor() { }

  ngOnInit() {
  }

}
