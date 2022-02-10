
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  processing = false;
  user: any = {};
  currentUrl!: any;
  loading: boolean = true;

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.getProfile().subscribe((data) => {
      if (!data.success) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
        this.processing = false;
      } else {
        // this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
        this.user = data.user;
        this.loading = false;
      }
    });
  }

  updateRegisterSubmit() {
    this.processing = true;
    // this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.editProfile(this.user).subscribe((data) => {
      if (!data.success) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
        this.processing = false;

      } else {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000)
      }
    });

  }

  goBack() {
    this.router.navigate(['/profile']);
  }

}
