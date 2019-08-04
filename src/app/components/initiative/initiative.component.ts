import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import BoardState from 'src/app/models/BoardState';
import _Token from 'src/app/models/Token';
import data from '../../data/board.json';

@Component({
  selector: 'app-initiative',
  templateUrl: './initiative.component.html',
  styleUrls: ['./initiative.component.sass']
})
export class InitiativeComponent implements OnInit {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  boardState: BoardState;
  gridScale: number;

  private ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
    this.boardState = new BoardState();
    this.boardState.width_squares = data.width_squares;
    this.boardState.height_squares = data.height_squares;
    this.boardState.tokens = {
      action: [],
      map: [],
      gm: []
    };
    data.tokens.action.map(tk => {
      this.boardState.tokens.action.push({
        x_coord: tk.x_coord,
        y_coord: tk.y_coord,
        width: tk.width,
        height: tk.height,
        color: tk.color
      });
    });
    data.tokens.map.map(tk => {
      this.boardState.tokens.map.push({
        x_coord: tk.x_coord,
        y_coord: tk.y_coord,
        width: tk.width,
        height: tk.height,
        color: tk.color
      });
    });
    data.tokens.gm.map(tk => {
      this.boardState.tokens.gm.push({
        x_coord: tk.x_coord,
        y_coord: tk.y_coord,
        width: tk.width,
        height: tk.height,
        color: tk.color
      });
    }); 

    this.canvas.nativeElement.width = window.innerWidth;

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.gridScale = Math.floor(Math.min(window.innerWidth / this.boardState.width_squares, this.canvas.nativeElement.height / this.boardState.height_squares));
    console.log(`GridScale: ${this.gridScale}`);
    this.drawGrid(this.boardState);
    this.update();
  }

  update(): void {

    this.boardState.tokens.action.forEach(token => {
      console.log(token);
      this.drawToken(token);
    });
  }

  drawGrid(_bs: BoardState): void {
    for(let i=0; i<_bs.width_squares; i++){
      for(let j=0; j<_bs.height_squares; j++){
        console.log(`Printing (${i}, ${j})`);
        this.ctx.strokeStyle = "#000000";
        this.ctx.strokeRect(i * this.gridScale, j * this.gridScale, (i + 1) * this.gridScale, (j + 1) * this.gridScale);
      }
    }
  }

  drawToken(token: _Token): void {
    this.ctx.fillStyle = token.color;
    this.ctx.fillRect(token.x_coord * this.gridScale, token.y_coord * this.gridScale, token.width * this.gridScale, token.height * this.gridScale); 
  }

}
