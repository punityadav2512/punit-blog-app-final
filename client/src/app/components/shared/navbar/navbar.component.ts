import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // private tokenExpired(token: string) {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }
  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    // if (this.tokenExpired(this.authService.authToken as string)) {
    //   // token expired
    //   return this.authService.logoutUser();
    // }

  }

  signupUser() {
    this.router.navigate(['/signup']);
  }

  loginUser() {
    this.router.navigate(['/login']);
  }
  logoutUser() {
    this.authService.logoutUser();
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: "You are logged out successfully!" });
    this.router.navigate(['/']);

  }


  isExpired() {
    return this.authService.loggedIn();
  }





}
