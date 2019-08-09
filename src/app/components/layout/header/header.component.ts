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

  constructor(private authService: AuthService) { }

  ngOnInit() {

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
