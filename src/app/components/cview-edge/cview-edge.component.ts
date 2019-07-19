import { Component, OnInit, Input } from '@angular/core';
import _Edge from 'src/app/models/Edge';

@Component({
  selector: 'app-cview-edge',
  templateUrl: './cview-edge.component.html',
  styleUrls: ['./cview-edge.component.sass']
})
export class CviewEdgeComponent implements OnInit {
  @Input() edge: _Edge;

  constructor() { }

  ngOnInit() {
    console.log(this.edge);
  }

}
