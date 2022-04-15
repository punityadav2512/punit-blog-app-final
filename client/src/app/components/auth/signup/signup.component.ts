import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { mimeType } from './mime-type.validator';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})


export class SignupComponent implements OnInit {
  profileImagePreview: any;
  emailValid: boolean = false;
  emailMessage: string = '';
  fileToReturn: any;


  registerForm!: FormGroup;
  processing: boolean = false;

  // imageChangedEvent: any = '';
  // croppedImage: any = '';

  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;
  // }

  // base64ToFile(data, filename) {

  //   const arr = data.split(',');
  //   const mime = arr[0].match(/:(.*?);/)[1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   let u8arr = new Uint8Array(n);

  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }

  //   return new File([u8arr], filename, { type: mime });
  // }

  // imageCropped(event: ImageCroppedEvent) {
  //   this.croppedImage = event.base64;
  // }
  // imageLoaded() {
  //   // show cropper
  //   console.log("image loaded");

  // }
  // cropperReady() {
  //   console.log('cropper ready')
  // }
  // loadImageFailed() {
  //   console.log("error");

  // }


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authSerivce: AuthService,
    private messageService: MessageService,
  ) {

  }

  ngOnInit(): void {
    this.createForm();
  }


  createForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        this.validateName
      ])],
      branch: ['', Validators.compose([
        Validators.required,
        this.validateBranch
      ])],
      year: ['', Validators.compose([
        Validators.required,
        // this.validateBranch
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(320),
        this.validateEmail
      ])],
      profilePic: [null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }],
      password: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          this.validatePassword
        ])
      ],
      confirmPassword: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),

        ])]
    }, {
      validators: this.passwordMatchValidator
    })
  }

  disableForm() {
    this.registerForm.controls['name'].disable();
    this.registerForm.controls['branch'].disable();
    this.registerForm.controls['year'].disable();
    this.registerForm.controls['email'].disable();
    this.registerForm.controls['profilePic'].disable();
    this.registerForm.controls['password'].disable();
    this.registerForm.controls['confirmPassword'].disable();
  }

  enableForm() {
    this.registerForm.controls['name'].enable();
    this.registerForm.controls['branch'].enable();
    this.registerForm.controls['year'].enable();
    this.registerForm.controls['email'].enable();
    this.registerForm.controls['profilePic'].enable();
    this.registerForm.controls['password'].enable();
    this.registerForm.controls['confirmPassword'].enable();

  }
  validateName(controls: FormGroup) {
    const regExp = new RegExp(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateName': true };
    }
  }
  validateBranch(controls: FormGroup) {
    const regExp = new RegExp(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateName': true };
    }
  }

  validateEmail(controls: FormGroup) {
    const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true };
    }
  }
  validatePassword(controls: FormGroup) {
    const regExp = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }


  // base64ToFile(data, filename) {

  //   const arr = data.split(',');
  //   const mime = arr[0].match(/:(.*?);/)[1];
  //   const bstr = atob(arr[1]);
  //   let n = bstr.length;
  //   let u8arr = new Uint8Array(n);

  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }

  //   return new File([u8arr], filename, { type: mime });
  // }

  // dataURItoBlob(dataURI) {
  //   console.log(dataURI);
  //   let imageData = this.croppedImage.compressed?.dataURL.toString();
  //   let byteCharacters = Buffer.from(imageData?.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')).toString('base64');
  //   let byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }

  //   let byteArray = new Uint8Array(byteNumbers);
  //   var blob = new Blob([byteArray], {
  //     type: undefined
  //   });
  //   return blob;
  // }


  onProfilePicPicked(event: Event) {

    // this.imageChangedEvent = event;

    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    // const file = (event.target as HTMLInputElement).files;
    this.registerForm.patchValue({ profilePic: file });
    this.registerForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const userData = {
      name: this.registerForm.get('name')?.value,
      branch: this.registerForm.get('branch')?.value,
      year: this.registerForm.get('year')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      profilePic: this.registerForm.get('profilePic')?.value
    }

    this.authSerivce.registerUser(this.registerForm.value.name, this.registerForm.value.branch, this.registerForm.value.year, this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.profilePic).subscribe({
      next: (data) => {
        if (!data.success) {
          this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
          this.processing = false;
          this.enableForm();
        } else {

          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
          this.authSerivce.storeUserData(data.token, data.userEmail);
          setTimeout(() => {
            this.router.navigate(['/blog']);
          }, 2000);
          //   timer(2000).toPromise().then(done => {
          //     this.location.back();
          //   })
        }

      }
    });
    this.registerForm.reset();
  }

  checkEmail() {
    this.authSerivce.checkEmail(this.registerForm.get('email')?.value).subscribe({
      next: (data) => {
        if (!data.success) {
          this.emailValid = false;
          this.emailMessage = data.message;
        } else {
          this.emailValid = true;
          this.emailMessage = data.message;
        }
      }
    });
  }








  passwordMatchValidator(controls: AbstractControl) {
    return controls.get('password')?.value === controls.get('confirmPassword')?.value ? null : { 'mismatch': true };
  }


}
