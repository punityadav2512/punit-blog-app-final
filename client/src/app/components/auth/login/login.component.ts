import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  processing: boolean = false;
  previousUrl!: string;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authSerivce: AuthService,
    private messageService: MessageService,
    private authGuard: AuthGuard
  ) { }

  ngOnInit(): void {
    if (this.authGuard.redirectUrl) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: "You are not authenticated to view that page" });
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined as any;
    }

    this.createForm();
  }



  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],

    })
  };

  disableForm() {
    this.loginForm.controls['email'].disable();
    this.loginForm.controls['password'].disable();
  }

  enableForm() {
    this.loginForm.controls['email'].enable();
    this.loginForm.controls['password'].enable();


  }

  onLoginSubmit() {
    this.processing = true;
    this.disableForm();
    this.authSerivce.loginUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).subscribe({
      next: (data) => {
        if (!data.success) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
          this.processing = false;
          this.enableForm();

        } else {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
          this.authSerivce.storeUserData(data.token, data.user);
          setTimeout(() => {
            if (this.previousUrl) {
              this.router.navigate([this.previousUrl]);
            } else {
              this.router.navigate(['/blog']);
            }
          }, 2000);

        }
      }
    });

    this.loginForm.reset();

  }



}
