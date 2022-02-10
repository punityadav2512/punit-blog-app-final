import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  processing: boolean = true;

  constructor(private authService: AuthService, private blogService: BlogService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) { }

  blog: any;
  requiredBlog: any;
  user: any;
  blogs: any;
  ngOnInit(): void {
    this._getProfile();
  }

  deleteProfile() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete your profile?',
      header: 'Delete Profile',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.deleteProfile().subscribe(
          {
            next: (data) => {
              if (!data.success) {
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
                this.processing = false;
              } else {
                this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
                this.authService.logoutUser();
                setTimeout(() => {
                  this.router.navigate(['/home'])
                }, 1000)
              }
            }
          }
        );
      },
      reject: () => { }
    });

  }


  private _getProfile() {
    this.authService.getProfile().subscribe({
      next: (data) => {
        if (!data.success) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
          this.processing = false;
        } else {
          // this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
          this.user = data.user;
        }
      }
    });
  }

}
