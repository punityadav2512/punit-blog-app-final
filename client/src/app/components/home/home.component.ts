import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users: any;
  foundUsers: boolean = false;

  constructor(private authService: AuthService, private messageService: MessageService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        if (!data.success) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
        } else {
          this.foundUsers = true;
          this.users = data.user;
        }
      }
    })

  }

  publicProfileView(email: string) {
    this.authService.getPublicProfile(email).subscribe({
      next: (data) => {
        this.router.navigate(['/user/', email]);
      }
    });
  }

  onCardClick() {
    this.router.navigate(['/jobs'])
  }
  onCardClick1() {
    this.router.navigate(['/admission'])
  }
}
