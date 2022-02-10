
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl: any;
  user: any;
  foundProfile: boolean = false;

  constructor(private authService: AuthService, private messageService: MessageService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.getPublicProfile(this.currentUrl.email).subscribe({
      next: (data) => {
        if (!data.success) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
        } else {
          this.foundProfile = true;
          this.user = data.user;
        }


      }
    })
  }

}
