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
  @ViewChild('zoomSlider', {static: true})
  zoomSlider: ElementRef<HTMLInputElement>;

  boardState: BoardState;

  gridScale: number;
  zoom: number;
  offset: {
    x_offset: number,
    y_offset: number
  };

  activeToken: {
    token: _Token,
    isDragging: boolean
  }
  grabData: {
    grab_x: number,
    grab_y: number,
    token: _Token,
    isDragging: boolean
  }

  drawData: {
    isDrawing: boolean,
    points: {x: number, y:number }[],
    stroke: {color: string, width: number, visible: boolean},
    fill: {color: string, visible: boolean}
  }

  customDrawings: {
    points: {x: number, y:number}[],
    stroke: {color:string, width:number, visible:boolean},
    fill: {color:string, visible:boolean}
  }[];

  tool: string;
  @ViewChild('toolHand', {static: false })
  toolHand: ElementRef<HTMLDivElement>;
  @ViewChild('toolSelect', {static: false })
  toolSelect: ElementRef<HTMLDivElement>;
  @ViewChild('toolDraw', {static: false })
  toolDraw: ElementRef<HTMLDivElement>;
  @ViewChild('toolMeasure', {static: false})
  toolMeasure: ElementRef<HTMLDivElement>;

  uibuttons: ElementRef<HTMLDivElement>[];

  private ctx: CanvasRenderingContext2D;

  constructor() { 
    this.zoom = 1;
    this.offset = {
      x_offset: 20,
      y_offset: 20
    };
    this.tool = "hand";
    this.grabData = {
      grab_x: null,
      grab_y: null,
      token: null,
      isDragging: false
    };
    this.drawData = {
      isDrawing: false,
      points: [],
      stroke: {
        color: "#000000",
        width: 1,
        visible: true
      },
      fill: {
        color: "#ffffff",
        visible: true
      }
    };
    this.customDrawings = [];
  }

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
    this.update();

    this.canvas.nativeElement.style.cursor = "all-scroll";
  }

  ngAfterViewInit(){
    this.uibuttons = [
      this.toolDraw,
      this.toolHand,
      this.toolSelect,
      this.toolMeasure
    ];
  }

  update(): void {
    // console.log("Update GO");
    this.clearCanvas();
    this.drawGrid(this.boardState);
    this.drawAllCustomShapes();
    this.drawTokens(this.boardState);
  }

  clearCanvas(): void {
    // console.log("Clear GO");
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  onResize(){
    this.canvas.nativeElement.width = window.innerWidth;
    this.update();
  }

  // Grab functions
  getTarget(event:MouseEvent): _Token {
    if(this.tool !== "select"){ return };
    // console.log("getting target");
    let mouse_x = event.x;
    let mouse_y = event.y - 40;
    // console.log(`(${mouse_x}, ${mouse_y})`);
    // console.log(this.boardState.tokens.action);
    let tkMatches = this.boardState.tokens.action.filter(tk => {
      let x_left = tk.x_coord * this.gridScale * this.zoom + this.offset.x_offset;
      let x_right = x_left + tk.width * this.gridScale * this.zoom;
      let y_top = tk.y_coord * this.gridScale * this.zoom + this.offset.y_offset;
      let y_bottom = y_top + tk.height * this.gridScale * this.zoom;

      if(
        mouse_x > x_left &&
        mouse_x < x_right &&
        mouse_y > y_top &&
        mouse_y < y_bottom
      ) {
        return true
      } else {
        return false
      }
    });
    // console.log(tkMatches);
    if(tkMatches.length > 0){ 
      this.grabData.token = tkMatches[0];
    } else {
      this.grabData.token = null;
    }

    this.update();
    return tkMatches[0];
  }

  pickUpToken(event: MouseEvent): void {
    // console.log("picking up GO");
    let Tk = this.getTarget(event);
    // console.log(Tk);
    if(Tk){
      this.grabData.grab_x = Tk.x_coord;
      this.grabData.grab_y = Tk.y_coord;

      // console.log(`Grabbing token: ${Tk}`);
      this.grabData.isDragging = true;
    }  
  }

  dragToken(event: MouseEvent): void {
    // console.log(event.x, event.y);
    let dx = event.movementX;
    let dy = event.movementY;
    // console.log(`dx=${dx}, dy=${dy}`);
    this.grabData.token.x_coord += dx / this.gridScale / this.zoom;
    this.grabData.token.y_coord += dy / this.gridScale / this.zoom;
  }

  dropToken(event: MouseEvent): void {
    if(this.grabData.isDragging){
      this.grabData.isDragging = false;
      this.grabData.token.x_coord = Math.max(Math.floor(this.grabData.token.x_coord + this.grabData.token.width / 2), 0);
      this.grabData.token.y_coord = Math.max(Math.floor(this.grabData.token.y_coord + this.grabData.token.height / 2), 0);
      this.grabData = {
        grab_x: null,
        grab_y: null,
        token: null,
        isDragging: false
      };
      this.update();
    }
  }

  // Doodle Functions
  startShape(event: MouseEvent): void { 
    this.drawData.isDrawing = true;
    this.drawData.points = [{x: event.x, y: event.y - 40}];
    console.log(`Started shape at (${event.x}, ${event.y - 40})`);
  }

  addVertex(event: MouseEvent): void {
    let origin = this.drawData.points[0];
    if(event.x <= origin.x + 10 && event.x >= origin.x - 10 && event.y <= origin.y + 50 && event.y >= origin.y - 30){
      this.closeShape(event);
      return
    }
    this.drawData.points.push({x: event.x, y: event.y - 40}); 
    console.log(`Added vertex at (${event.x}, ${event.y - 40})`);
  }

  closeShape(event: MouseEvent):void {
    let DD = this.drawData;
    let coords = DD.points.map(point => {
      let newCoords = {
        x: (point.x - this.offset.x_offset) / (this.gridScale * this.zoom),
        y: (point.y - this.offset.y_offset) / (this.gridScale * this.zoom)
      }
      return newCoords
    });
    DD.points = coords;
    this.customDrawings.push(DD);
    this.clearDrawData();
    this.update();
  }

  drawAllCustomShapes():void {
    this.customDrawings.forEach(drawing => {
      this.drawCustomShape(drawing.points, drawing.stroke, drawing.fill);
    });
  }

  drawCustomShape(points: {x:number, y:number}[], stroke:{color:string, width:number, visible:boolean}, fill:{color:string, visible:boolean}):void {
    this.ctx.beginPath();
    this.ctx.moveTo(
      points[0].x * this.gridScale * this.zoom + this.offset.x_offset,
      points[0].y * this.gridScale * this.zoom + this.offset.y_offset
    );

    for(let i=1; i< points.length; i++){
      this.ctx.lineTo(
        points[i].x * this.gridScale * this.zoom + this.offset.x_offset, 
        points[i].y * this.gridScale * this.zoom + this.offset.y_offset
      );
    }

    this.ctx.lineTo(
      points[0].x * this.gridScale * this.zoom + this.offset.x_offset,
      points[0].y * this.gridScale * this.zoom + this.offset.y_offset
    );

    this.ctx.lineWidth = stroke.width;
    this.ctx.strokeStyle = stroke.color;
    if(stroke.visible){
      this.ctx.stroke(); 
    }
    this.ctx.fillStyle = fill.color;
    if(fill.visible){
      this.ctx.fill();
    }
  }

  clearDrawData():void {
    this.drawData = {
      isDrawing: false,
      points: [],
      stroke: {
        color: "#000000",
        width: 1,
        visible: true
      },
      fill: {
        color: "#ffffff",
        visible: true
      }
    }; 
  }

  setShapeStroke(width?: number, color?:string, visible?:boolean): void {
    if(width){ 
      this.drawData.stroke.width = width;
    }
    if(color){
      this.drawData.stroke.color = color; 
    }
    if(visible != null){
      this.drawData.stroke.visible = visible; 
    } 
  }

  setShapeFill(color?: string, visible?:boolean): void {
    if(color){
      this.drawData.fill.color = color;
    }
    if(visible != null){
      this.drawData.fill.visible = visible;
    } 
  }

  visualizeShape():void {
    this.ctx.fillStyle = "#aa33ff";
    this.drawData.points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      if(point === this.drawData.points[0]){
        this.ctx.stroke();
      } else {
        this.ctx.fill(); 
      }
    });
  }

  // Tool Swapper
  changeTool(tool:string){
    // console.log(tool);
    this.tool = tool;
    switch(tool){
      case "hand":
        this.canvas.nativeElement.style.cursor = "all-scroll";
        this.uibuttons.forEach(button => {
          if(button === this.toolHand){
            button.nativeElement.classList.add("active");
          } else { 
            button.nativeElement.classList.remove("active");
          }
        });
        break;
      case "select": 
        this.canvas.nativeElement.style.cursor = "cursor";
        this.uibuttons.forEach(button => {
          if(button === this.toolSelect){
            button.nativeElement.classList.add("active");
          } else { 
            button.nativeElement.classList.remove("active");
          }
        });
        break;
      case "draw":
        this.canvas.nativeElement.style.cursor =  "crosshair";
        this.uibuttons.forEach(button => {
          if(button === this.toolDraw){
            button.nativeElement.classList.add("active");
          } else { 
            button.nativeElement.classList.remove("active");
          }
        });
        break;
      case "measure":
        this.canvas.nativeElement.style.cursor = "cell";
        this.uibuttons.forEach(button => {
          if(button === this.toolMeasure){
            button.nativeElement.classList.add("active");
          } else { 
            button.nativeElement.classList.remove("active");
          }
        });
        break;
    }
  }

  // Mouse Click Handler
  mouseClickHandler(event: MouseEvent): void {
    if(this.tool === "draw"){
      console.log("Doing the draw thing");
      if(!this.drawData.isDrawing){
        this.drawData.isDrawing = true;
        this.startShape(event);
      } else {
        this.addVertex(event);
      }
      this.visualizeShape();
    } else if(this.tool === "select"){
      this.getTarget(event);
    }
  }

  // Mousedown Handler
  mouseDownHandler(event: MouseEvent): void {
    if(this.tool === "select"){
      this.pickUpToken(event);
      this.update();
    }
  }

  // Mouse Move Handler
  mouseMoveHandler(event: MouseEvent): void {
    if(event.ctrlKey || (this.tool === "hand" && event.buttons === 1)){
      this.panGrid(event);
    } else if(this.tool === "select" && this.grabData.isDragging){
      this.dragToken(event);
      this.update();
    } 
  }

  // Mouse Up Handler
  mouseUpHandler(event: MouseEvent): void {
    if(this.tool === "select" && this.grabData.isDragging){
      this.dropToken(event);
      this.update();
    }
  }

  // Mouse Out Handler
  mouseOutHandler(event: MouseEvent): void {
    if(this.tool === "select" && this.grabData.isDragging){
      this.grabData.token.x_coord = this.grabData.grab_x;
      this.grabData.token.y_coord = this.grabData.grab_y;
      this.grabData.isDragging = false;
      this.grabData.token = null;
      this.update();
    }
  }

  // Zoom Functions
  zoomIn():void {
    let currentZoom = parseInt(this.zoomSlider.nativeElement.value);
    let modZoom: number;

    if(this.zoom > 1){
      modZoom = currentZoom += 1;
    } else {
      modZoom = currentZoom += 0.5;
    }
    this.zoomSlider.nativeElement.value = modZoom.toString();
    this.zoom = modZoom / 8;
    this.update();
  }

  zoomOut():void {
    let currentZoom = parseInt(this.zoomSlider.nativeElement.value);
    let modZoom:number;
    if(this.zoom > 1){
      modZoom = currentZoom -= 1;
    } else {
      modZoom = currentZoom -= 0.5;
    }
    this.zoomSlider.nativeElement.value = modZoom.toString();
    this.zoom = modZoom / 8;
    this.update();
  }

  zoomUpdate(event: MouseEvent):void {
    if(event.buttons === 1){
      let zoomval: number = parseInt(this.zoomSlider.nativeElement.value);
      this.zoom = zoomval / 8;
      this.update();
      // console.log(this.zoom);
    }
  }

  // Pan Function
  panGrid(event: MouseEvent){
      this.offset.x_offset += event.movementX;
      this.offset.y_offset += event.movementY;
      this.update();
  }

  // Draw Functions
  drawGrid(_bs: BoardState): void {
    // console.log("Draw Grid GO");
    for(let i=0; i<_bs.width_squares; i++){
      for(let j=0; j<_bs.height_squares; j++){
        // console.log(`Printing (${i}, ${j})`);
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = "#f3f3f3";
        let cx:number = i * this.gridScale * this.zoom + this.offset.x_offset;
        let cy:number = j * this.gridScale * this.zoom + this.offset.y_offset;
        let cw:number = this.gridScale * this.zoom;
        let ch:number = this.gridScale * this.zoom;
        if(
          Math.max(cx - 2*cw) < this.canvas.nativeElement.width || 
          Math.max(cy - 2*ch) < this.canvas.nativeElement.height ||
          cx > -cw ||
          cy > -ch
        ){
          this.ctx.fillRect(cx, cy, cw, ch);
          this.ctx.strokeRect(cx, cy, cw, ch);
        } 
      }
    }
  }

  drawMap(_bs: BoardState): void {
    _bs.tokens.map.forEach(mapElement => {
      this.drawToken(mapElement);
    });
  }

  drawGMLayer(_bs: BoardState): void {
    _bs.tokens.gm.forEach(gt => {
      this.drawToken(gt);
    });
  }

  drawTokens(_bs: BoardState): void {
    _bs.tokens.action.forEach(token => { 
      this.drawToken(token);
    });
    if(this.grabData.token){ 
      this.drawToken(this.grabData.token);
    }
  }

  drawToken(token: _Token): void {
    // console.log("Draw Token GO");
    this.ctx.fillStyle = token.color;
    let tx: number = token.x_coord * this.gridScale * this.zoom + this.offset.x_offset;
    let ty: number = token.y_coord * this.gridScale * this.zoom + this.offset.y_offset;
    let tw: number = token.width * this.gridScale * this.zoom;
    let th: number = token.width * this.gridScale * this.zoom;
    if(
      Math.max(tx - 2*tw ) < this.canvas.nativeElement.width || 
      Math.max(ty - 2*th ) < this.canvas.nativeElement.height || 
      tx > -tw ||
      ty > -th )
    {
      if(token.icon){ 
        // console.log(token.icon);
        this.ctx.font = `${this.gridScale}px FontAwesome`;
        this.ctx.fillText(token.icon, tx, ty);
      } else { 
        this.ctx.fillRect(tx, ty, tw, th); 
      }
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(tx, ty, tw, th);
    } 
    if(token === this.grabData.token){
      // console.log(`Matched Token: ${token}`);
      this.drawBoundingBox(token);
    }
  }

  drawBoundingBox(token: _Token):void {
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 2;
    let bbx:number = token.x_coord * this.gridScale * this.zoom + this.offset.x_offset;
    let bby:number = token.y_coord * this.gridScale * this.zoom + this.offset.y_offset;
    let bbw:number = token.width * this.gridScale * this.zoom;
    let bbh:number = token.height * this.gridScale * this.zoom;
    if(
      Math.max(bbx - 2*bbw) < this.canvas.nativeElement.width ||
      Math.max(bby - 2*bbh) < this.canvas.nativeElement.height ||
      bbx > -bbw ||
      bby > -bbh )
    {
    this.ctx.strokeRect(bbx, bby, bbw, bbh);
    } 
    this.drawBBHandles(token, {x: bbx, y: bby, width: bbw, height: bbh});
  }

  drawBBHandles(token: _Token, box:{x:number, y:number, width:number, height: number }): void {
    let topleft: {x:number, y:number} = {
      x: box.x,
      y: box.y
    };
    let topright: {x:number, y:number} = {
      x: box.x + box.width,
      y: box.y
    };
    let bottomleft: {x: number, y:number} = {
      x: box.x,
      y: box.y + box.height
    };
    let bottomright: {x:number, y:number } = {
      x: box.x + box.width,
      y: box.y + box.height
    };
    let corners: {x:number, y:number}[] = [topleft, topright, bottomleft, bottomright];

    this.ctx.fillStyle = "#ff0000";

    corners.forEach(corner => {
      this.ctx.fillRect(corner.x - 5, corner.y - 5, 10, 10);
    });

    let topmiddle: {x: number, y:number } = {
      x: topleft.x + 0.5 * box.width - 5,
      y: topleft.y
    };

    this.ctx.beginPath();
    this.ctx.moveTo(topmiddle.x + 5, topmiddle.y);
    this.ctx.lineTo(topmiddle.x + 5, topmiddle.y - 25);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(topmiddle.x + 5, topmiddle.y - 25, 5, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.fill();
    // this.ctx.fillRect(topmiddle.x, topmiddle.y - 25, 10, 10);
  }
}
