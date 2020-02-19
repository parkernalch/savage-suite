import { Component, OnInit, Input } from '@angular/core';
import _ChatMessage from 'src/app/models/ChatMessage';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass']
})
export class MessageComponent implements OnInit {
  @Input() message:_ChatMessage;
  @Input() me?:string;
  initials:string;
  showDate:boolean = false;

  constructor() { }

  ngOnInit() {
    console.log(this.me);
    this.initials = this.message.user
      .split(' ')
      .map(word => word.substr(0,1))
      .join('')
  }

  toggleShowDate():void{
    this.showDate = !this.showDate;
  }

}
