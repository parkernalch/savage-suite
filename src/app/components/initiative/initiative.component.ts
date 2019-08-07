import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, ObjectUnsubscribedError } from 'rxjs';
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

  grabData: {
    grab_x: number,
    grab_y: number,
    token: _Token,
    isDragging: boolean,
    isRotating: boolean,
    isGroup: boolean,
    // group?: _Token[]
    group?: {
      token: _Token,
      startLoc: {
        x:number,
        y:number
      }
    }[],
    initialangle?:number
  }

  drawData: {
    isDrawing: boolean,
    points: {x: number, y:number }[],
    stroke: {color: string, width: number, visible: boolean},
    fill: {color: string, visible: boolean}
  }
  tokenCache: HTMLImageElement[];

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
    this.tool = "select";
    this.grabData = {
      grab_x: null,
      grab_y: null,
      token: null,
      isDragging: false,
      isRotating: false,
      isGroup: false,
      group: [],
      initialangle: null
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
    this.tokenCache = [];
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
        color: tk.color,
        icon: tk.icon,
        htmlImage: null,
        rotation: tk.rotation || 0,
        scale: tk.scale || 1
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

    this.boardState.tokens.action.forEach(tk => {
      if(tk.icon){
        this.loadImage(tk.icon).subscribe(_I => tk.htmlImage = _I);
      }
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

  // Update() redraws all objects on the canvas (Grid, Custom, Tokens)
  update(): void {
    this.clearCanvas();
    this.ctx.strokeStyle = "#000000";
    this.ctx.setLineDash([0]);
    this.ctx.lineWidth = 2;
    this.drawGrid(this.boardState);
    this.drawAllCustomShapes();
    this.drawTokens(this.boardState);
  }

  // Utility function for clearing the canvas
  clearCanvas(): void {
    // console.log("Clear GO");
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  // Triggered when window resizes, this makes sure the canvas fills the screen width
  onResize(){
    this.canvas.nativeElement.width = window.innerWidth;
    this.update();
  }

  // Helper function that converts event position to coordinates on the map grid
  screenToCoords(x:number, y:number):{x:number,y:number} {
    return {
      x: Math.floor((x - this.offset.x_offset) / (this.gridScale * this.zoom)),
      y: Math.floor((y - 40 - this.offset.y_offset) / (this.gridScale * this.zoom))
    }
  }

  // Helper function that converts token coordinates to screen coordinates
  coordsToScreen(x:number, y:number):{x:number,y:number} {
    return {
      x: x * this.gridScale * this.zoom + this.offset.x_offset,
      y: y * this.gridScale * this.zoom + this.offset.y_offset + 40
    }
  }

  // =======================
  // GRAB AND MOVE FUNCTIONS
  // =======================

  // Compare mouse location to the token locations and return a reference to the first matched token
  // I call update() at the end so the bounding boxes are drawn immediately
  getTarget(event:MouseEvent): _Token {
    if(this.tool !== "select"){ return };

    let tkMatches = this.boardState.tokens.action.filter(tk => {
      let tkScreenCoords = this.coordsToScreen(tk.x_coord,tk.y_coord);
      return (
        event.x > tkScreenCoords.x &&
        event.x < tkScreenCoords.x + tk.width * this.gridScale * this.zoom * tk.scale &&
        event.y > tkScreenCoords.y &&
        event.y < tkScreenCoords.y + tk.height * this.gridScale * this.zoom * tk.scale
        );
    });

    if(tkMatches.length > 0){ 
      this.grabData.token = tkMatches[0];
    } else {
      // console.log("no token at location");
      // this.grabData.token = this.grabData.token;
      // this.grabData.token = null;
    }

    this.update();
    return tkMatches[0];
  }

  startGroupSelect(event:MouseEvent):void { 
    this.grabData.isGroup = true;
    this.grabData.grab_x = event.x;
    this.grabData.grab_y = event.y;
  }
  
  groupSelect(event:MouseEvent): void {
    let x_vals:number[] = [event.x, this.grabData.grab_x];
    let y_vals:number[] = [event.y, this.grabData.grab_y];

    let mins = this.screenToCoords(Math.min(...x_vals), Math.min(...y_vals));
    let maxs = this.screenToCoords(Math.max(...x_vals), Math.max(...y_vals));

    let tokens = this.boardState.tokens.action.filter(token => {
      return (
        token.x_coord <= maxs.x &&
        token.x_coord >= mins.x &&
        token.y_coord <= maxs.y &&
        token.y_coord >= mins.y
      )
    });

    this.grabData.group = tokens.map(tk => {
      return {
        token: tk,
        startLoc: {
          x: tk.x_coord,
          y: tk.y_coord
        }
      }
    })
    // console.log(tokens);
  }

  visualizeGroupSelect(event:MouseEvent):void {
    this.ctx.strokeStyle = "#333333";
    this.ctx.setLineDash([5]);
    this.ctx.lineWidth = 1;

    let width:number = event.x - this.grabData.grab_x;
    let height:number = event.y - this.grabData.grab_y;
    this.ctx.strokeRect(this.grabData.grab_x, this.grabData.grab_y - 40, width, height);
  }
  
  // Adds token location to grabData just in case token is dropped in a forbidden location (or off-screen)
  pickUpToken(event: MouseEvent): boolean {
    if(this.grabData.group.length === 0){
      let Tk = this.getTarget(event);
      if(Tk){
        this.grabData.grab_x = Tk.x_coord;
        this.grabData.grab_y = Tk.y_coord;

        this.grabData.isDragging = true;
      } else {
        return false
      } 
    } else {
      let grabCoords = this.screenToCoords(event.x, event.y);
      this.grabData.grab_x = grabCoords.x;
      this.grabData.grab_y = grabCoords.y

      this.grabData.isDragging = true;
    }
    return true
  }

  // Increments the position of the dragged token by the event movement props
  // TODO: Fix strange behavior on smaller? screens
  dragToken(event: MouseEvent): void {
    let dx = event.movementX;
    let dy = event.movementY;
    if(this.grabData.group.length === 0){ 
      this.grabData.token.x_coord += dx / this.gridScale / this.zoom;
      this.grabData.token.y_coord += dy / this.gridScale / this.zoom;
    } else if (this.grabData.group.length > 0){
      this.grabData.group.forEach(tk => {
        tk.token.x_coord += dx / this.gridScale / this.zoom;
        tk.token.y_coord += dy / this.gridScale / this.zoom; 
      })
    }
  }

  // Finds the nearest cell to the center of the token and snaps its location accordingly
  // DONE: Allow non-snapping drop if some button is held (probably ~SHIFT~ it's ALT now)
  dropToken(event: MouseEvent): void {
    if(this.grabData.isDragging){
      this.grabData.isDragging = false;
      if(event.altKey){
        if(this.grabData.group.length === 0) {
          this.grabData.token.x_coord = Math.max(this.grabData.token.x_coord, 0);
          this.grabData.token.y_coord = Math.max(this.grabData.token.y_coord, 0); 
        } else {
          this.grabData.group.forEach(tk => { 
            tk.token.x_coord = Math.max(tk.token.x_coord, 0);
            tk.token.y_coord = Math.max(tk.token.y_coord, 0); 
          })
        }
      } else {
        if(this.grabData.group.length === 0){
          this.grabData.token.x_coord = Math.max(Math.floor(this.grabData.token.x_coord + this.grabData.token.width / 2), 0);
          this.grabData.token.y_coord = Math.max(Math.floor(this.grabData.token.y_coord + this.grabData.token.height / 2), 0); 
        } else {
          this.grabData.group.forEach(tk => {
            tk.token.x_coord = Math.max(Math.floor(tk.token.x_coord + tk.token.width / 2), 0);
            tk.token.y_coord = Math.max(Math.floor(tk.token.y_coord + tk.token.height / 2), 0); 
          });
        }
      }
      this.grabData = {
        grab_x: null,
        grab_y: null,
        token: null,
        isDragging: false,
        isRotating: false,
        isGroup: false,
        group: [],
        initialangle: null
      };
      this.update();
    }
  }

  clearGrabData(event:MouseEvent):void {
    if(this.grabData.group.length > 0){
      let outCoords = this.screenToCoords(event.x, event.y);
      this.grabData.group.forEach(tk => {
        tk.token.x_coord = tk.startLoc.x;
        tk.token.y_coord = tk.startLoc.y;
      });
    } else if(this.grabData.token) {
      this.grabData.token.x_coord = this.grabData.grab_x;
      this.grabData.token.y_coord = this.grabData.grab_y; 
    }
    this.grabData.token = null;
    this.grabData.isDragging = false;
    this.grabData.group = [];
    this.grabData.isGroup = false; 
    this.grabData.isRotating = false;
  }

  startRotateToken(event:MouseEvent):void {
    let screenCoords = this.coordsToScreen(this.grabData.token.x_coord, this.grabData.token.y_coord);
    // console.log('starting rotate');
    this.grabData.isDragging = false;
    this.grabData.grab_x = screenCoords.x + this.grabData.token.width * this.gridScale * this.zoom * this.grabData.token.scale/2;
    this.grabData.grab_y = screenCoords.y + this.grabData.token.height * this.gridScale * this.zoom * this.grabData.token.scale/2;
    this.grabData.group = [];
    this.grabData.isGroup = false;
    this.grabData.isRotating = true;
    this.grabData.initialangle = this.grabData.token.rotation; 
  }

  rotateToken(event:MouseEvent):void {
    let h:number = event.y - this.grabData.grab_y;
    let b:number = event.x - this.grabData.grab_x;
    let ang:number = Math.atan2(h, b) * 180/Math.PI + this.grabData.initialangle; 
    if(event.shiftKey){
      ang = Math.round(ang / 45);
      // console.log(ang);
      this.grabData.token.rotation = ang * 45 + 90;
    } else { 
      this.grabData.token.rotation = ang + 90;
    }
    this.update();
  }

  stopRotateToken(event:MouseEvent):void{
    this.grabData.token.rotation = this.grabData.token.rotation % 360;
    this.grabData.isRotating = false;
  }

  // ========================
  // CUSTOM DRAWING FUNCTIONS
  // ========================

  // Kicks off the shape drawing process by loading in the first point into this.drawData
  // WARNING: if I get rid of the top bar, the 40 pixel modification to the y position won't be accurate anymore
  // it is accounting for the header height
  startShape(event: MouseEvent): void { 
    this.drawData.isDrawing = true;
    this.drawData.points = [{x: event.x, y: event.y - 40}];
  }

  // If you click within a 10px radius of the starting node, addVertex will call closeShape instead
  // Otherwise, addVertex appends the new event location to the array of drawing vertices
  addVertex(event: MouseEvent): void {
    let origin = this.drawData.points[0];
    if(event.x <= origin.x + 10 && event.x >= origin.x - 10 && event.y <= origin.y + 50 && event.y >= origin.y - 30){
      this.closeShape(event);
      return
    }
    this.drawData.points.push({x: event.x, y: event.y - 40}); 
  }

  // closeShape converts the point values (prior to now, they were in screen pixels) to grid coordinates
  // this will allow even custom shapes to move, scale, etc along with the grid as a whole
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

  // simple helper function that loops through the customDrawings array and draws each
  drawAllCustomShapes():void {
    this.customDrawings.forEach(drawing => {
      this.drawCustomShape(drawing.points, drawing.stroke, drawing.fill);
    });
  }

  // this draws a custom shape given a specific input set of parameters. Allows for customizability
  // of the visual aspect of the drawn shape
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

  // another helper function that resets this.drawData back to a 'null'-ish state
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

  // unused right now, but this function will allow the user to set properties of the context stroke
  setShapeStroke(input: {width?: number, color?:string, visible?:boolean}): void {
    if(input.width){ 
      this.drawData.stroke.width = input.width;
    }
    if(input.color){
      this.drawData.stroke.color = input.color; 
    }
    if(input.visible != null){
      this.drawData.stroke.visible = input.visible; 
    } 
  }

  // also unused, allow user to set properties of the context fill
  setShapeFill(input: {color?: string, visible?:boolean}): void {
    if(input.color){
      this.drawData.fill.color = input.color;
    }
    if(input.visible != null){
      this.drawData.fill.visible = input.visible;
    } 
  }

  // visualizeShape puts small circles at each node as the drawing is still being completed
  // DONE: connect the circles with a light line so user can visualize what she's drawing
  // TODO: utilize clearCanvas and update so the lines aren't redrawn (and darken) every frame
  visualizeShape():void {
    this.ctx.fillStyle = "#aa33ff";
    this.ctx.strokeStyle = "#aa33ff";
    this.drawData.points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      if(point === this.drawData.points[0]){
        this.ctx.stroke();
      } else {
        this.ctx.fill(); 
      }
    });

    this.ctx.beginPath();
    this.drawData.points.forEach(point => {
      this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();
  }

  // ============
  // TOOL SWAPPER
  // ============

  // swaps tool that controls the mouse handlers
  // TODO: DRY it up and move the forEach statements to a default section
  changeTool(tool:string){
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
        this.canvas.nativeElement.style.cursor = "default";
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

  // ====================
  // MOUSE EVENT HANDLERS
  // ====================

  // Mouse Click Handler routes the function calls based on the active tool
  mouseClickHandler(event: MouseEvent): void {
    if(this.tool === "draw"){
      if(!this.drawData.isDrawing){
        this.drawData.isDrawing = true;
        this.startShape(event);
      } else {
        this.addVertex(event);
      }
      this.visualizeShape();
    }  
    else if(this.tool === "select"){
      if(!this.getTarget(event)){
        this.grabData.token = null;
        this.update();
      }
    }
  }

  // Mousedown Handler so far only handles picking up a token
  mouseDownHandler(event: MouseEvent): void { 
    if(this.tool === "select"){
      let mouseCoords = this.screenToCoords(event.x, event.y);
      if(!this.pickUpToken(event)){
        if(
          this.grabData.token &&
          mouseCoords.x > this.grabData.token.x_coord - this.grabData.token.scale &&
          mouseCoords.x < this.grabData.token.x_coord + this.grabData.token.scale &&
          mouseCoords.y < this.grabData.token.y_coord &&
          mouseCoords.y > this.grabData.token.y_coord - 2 
        ) {
          this.startRotateToken(event);
        } else { 
          this.startGroupSelect(event);
        }
      }
    } else if (this.tool === "measure"){

    }

    this.update();
  }

  // Mouse Move Handler handles dragging of an object or panning the canvas
  mouseMoveHandler(event: MouseEvent): void {
    if(event.ctrlKey || (this.tool === "hand" && event.buttons === 1)){
      this.panGrid(event);
    } else if(this.tool === "select" && this.grabData.isDragging && !this.grabData.isRotating){
      this.dragToken(event);
      this.update();
    }  else if (this.tool === "select" && !this.grabData.isDragging && event.buttons === 1 && !this.grabData.isRotating){
      this.update();
      this.visualizeGroupSelect(event);
    } else if (this.tool === "select" && this.grabData.isRotating){
      this.rotateToken(event);
    }
  }

  // Mouse Up Handler handles releasing a dragged object at this time
  mouseUpHandler(event: MouseEvent): void {
    if(this.tool === "select"){
      if(this.grabData.isDragging){
        this.dropToken(event);
      }
      else if(this.grabData.isGroup){
        this.groupSelect(event);
      }
      else if (this.grabData.isRotating){
        this.stopRotateToken(event);
      }
      this.update();
    }
  }

  // Mouse Out Handler catches a user trying to drag an object off screen
  // DONE: break the function code into a method instead of handling the select-specific event
  // inside the mouse handler
  mouseOutHandler(event: MouseEvent): void {
    if(this.tool === "select" && this.grabData.isDragging){
      this.clearGrabData(event);
      this.update();
    }
  }

  // ==============
  // ZOOM FUNCTIONS
  // ==============

  // Zoom in incrementally (and adds a slightly smaller zoom factor than you can get with the slider)
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

  // Zoom out incrementally
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

  // Called on mousemove for the zoom slider and only if the mouse 1 button is down
  // TODO: simplify the input range and step value so we don't have to divide by 8
  zoomUpdate(event: MouseEvent):void {
    if(event.buttons === 1){
      let zoomval: number = parseInt(this.zoomSlider.nativeElement.value);
      this.zoom = zoomval / 8;
      this.update();
    }
  }

  // Binding the scroll wheel to zoom in and out on the map
  scrollZoom(event:any){
    if(event.altKey){
      if(event.deltaY > 0){
        this.zoomOut();
      } else {
        this.zoomIn();
      }
    }
  }

  // Pan Function
  // TODO: verify that this works on different screens/machines. This has the same code as the 
  // buggy drag object code
  panGrid(event: MouseEvent){
      this.offset.x_offset += event.movementX;
      this.offset.y_offset += event.movementY;
      this.update();
  }

  // ====================
  // BASIC DRAW FUNCTIONS
  // ====================

  // draws each cell of a grid based on BoardState, ignoring the draw calls if the cell is out
  // of visual range
  drawGrid(_bs: BoardState): void {
    for(let i=0; i<_bs.width_squares; i++){
      for(let j=0; j<_bs.height_squares; j++){
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = "#f3f3f3";
        this.ctx.lineWidth = 0.5;
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

  // draws each token in the map array
  drawMap(_bs: BoardState): void {
    _bs.tokens.map.forEach(mapElement => {
      this.drawToken(mapElement);
    });
  }

  // draws each token in the GM array
  drawGMLayer(_bs: BoardState): void {
    _bs.tokens.gm.forEach(gt => {
      this.drawToken(gt);
    });
  }

  // draws each token in the Main Token array
  // extra bonus: highlights the active object by drawing a bounding box in red
  drawTokens(_bs: BoardState): void {
    _bs.tokens.action.forEach(token => { 
      this.drawToken(token);
    });
    if(this.grabData.token){ 
      this.drawToken(this.grabData.token);
    }
  }

  // Generic draw token function
  // DONE: implement either fontawesome drawing or image drawing so we can move past these colored squares
  drawToken(token: _Token): void {
    this.ctx.fillStyle = token.color;
    let tx: number = token.x_coord * this.gridScale * this.zoom + this.offset.x_offset;
    let ty: number = token.y_coord * this.gridScale * this.zoom + this.offset.y_offset;
    let tw: number = token.width * this.gridScale * this.zoom * token.scale;
    let th: number = token.width * this.gridScale * this.zoom * token.scale;

    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = 2;
    if(
      Math.max(tx - 2*tw ) < this.canvas.nativeElement.width || 
      Math.max(ty - 2*th ) < this.canvas.nativeElement.height || 
      tx > -tw ||
      ty > -th )
    {
      if(token.htmlImage){
        if(token.rotation !== 0){ 
          this.ctx.setTransform(1, 0, 0, 1, tx + tw/2, ty + th/2);
          this.ctx.rotate(token.rotation * Math.PI / 180.0);
          this.ctx.drawImage(token.htmlImage, -tw/2, -th/2, tw, th);
          this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          this.ctx.drawImage(token.htmlImage, tx, ty, tw, th);
        }
      // } else if(token.icon){ 
      //   this.ctx.font = `${this.gridScale}px FontAwesome`;
      //   this.ctx.fillText(token.icon, tx, ty);
      // } else { 
      } else {
        this.ctx.fillRect(tx, ty, tw, th); 
        this.ctx.strokeRect(tx, ty, tw, th);
      }
    } 
    if(token === this.grabData.token){
      this.drawBoundingBox(token);
    }
    if(this.grabData.group.map(obj => obj.token).includes(token)){
      this.drawBoundingBox(token);
    }
  }

  // Load Image from URL
  loadImage(src:string): Observable<HTMLImageElement>{
    // create image object
    var image = new Image();
    image.onload = () => this.update();

    image.src = src;
    return of(image);
  }

  // Draws bounding box around the token along the cell lines in its periphery
  drawBoundingBox(token: _Token):void { 
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 2;
    let bbx:number = token.x_coord * this.gridScale * this.zoom + this.offset.x_offset;
    let bby:number = token.y_coord * this.gridScale * this.zoom + this.offset.y_offset;
    let bbw:number = token.width * this.gridScale * this.zoom * token.scale;
    let bbh:number = token.height * this.gridScale * this.zoom * token.scale;
    if(this.grabData.isRotating){
      this.ctx.beginPath();
      this.ctx.arc(bbx + bbw/2, bby + bbh/2, bbh/1.5, 0, Math.PI *2);
      this.ctx.stroke();
    } else {
      if(
        Math.max(bbx - 2*bbw) < this.canvas.nativeElement.width ||
        Math.max(bby - 2*bbh) < this.canvas.nativeElement.height ||
        bbx > -bbw ||
        bby > -bbh )
      {
        this.ctx.strokeRect(bbx, bby, bbw, bbh);
        this.drawBBHandles(token, {x: bbx, y: bby, width: bbw, height: bbh});
      } 
    }
  }

  // Draws the little handles in the corners (square) and attached to a rotation arm (circle)
  // TODO: Add logic to the handlers to allow for scaling, rotating
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

    if(!this.grabData.isGroup){ 
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
    }
  }
}
