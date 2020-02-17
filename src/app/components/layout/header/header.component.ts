import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { viewClassName } from '@angular/compiler';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @ViewChild('darkOverlay', {static: true})
  darkOverlay: ElementRef<HTMLDivElement>;
  @ViewChild('loginModal', {static: true})
  loginModal: ElementRef<HTMLDivElement>;

  @ViewChild('usernameInput', {static: true })
  usernameInput: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput', {static: true })
  passwordInput: ElementRef<HTMLInputElement>;

  topOffset:number = 0;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    document.addEventListener('scroll', (e:Event) => {
      if(document.documentElement.scrollTop > 30 && this.topOffset === 0){
        this.MinimizeHeader();
      } else if (document.documentElement.scrollTop === 0 && this.topOffset < 0){
        this.MaximizeHeader();
      }
    }) 
  }

  MaximizeHeader():void{
    let minimizing = setInterval(() => {
      this.topOffset += 1;
      if(this.topOffset >= 0){
        this.topOffset = 0;
        clearInterval(minimizing);
      }
    }, 5);
  }

  MinimizeHeader():void{ 
    let maximizing = setInterval(() => {
      this.topOffset -= 1;
      if(this.topOffset <= -45){
        this.topOffset = -45;
        clearInterval(maximizing);
      }
    }, 5);
  }

  ngAfterViewInit() {
    // console.log(this.darkOverlay);
    // console.log(this.loginModal);
  }

  displayLoginModal():void {
    // console.log("displaying login");
    this.darkOverlay.nativeElement.style.display = "block";
    this.loginModal.nativeElement.style.display = "block";
    let t = setTimeout(() => {
      this.darkOverlay.nativeElement.style.opacity = "0.5";
      this.loginModal.nativeElement.style.opacity = "1"; 
    }, 200);
  }

  dismissModal(): void {
    // console.log("dismissing login"); 
    this.loginModal.nativeElement.style.opacity = "0";
    this.darkOverlay.nativeElement.style.opacity = "0";
    let t = setTimeout(() => {
      this.darkOverlay.nativeElement.style.display = "none"; 
      this.loginModal.nativeElement.style.display = "none"; 
    }, 500);
  }

  validateUser(): void {
    console.log("validating modal contents");
    let uname = this.usernameInput.nativeElement.value;
    let pwd = this.passwordInput.nativeElement.value;
    this.authService.login(uname, pwd);
  }

}
