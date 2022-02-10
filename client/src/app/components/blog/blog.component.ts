import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { mimeType } from '../auth/signup/mime-type.validator';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  newPost: boolean = false;
  loadingBlogs: boolean = false;
  blogForm!: FormGroup;
  processing: boolean = false;
  imagePreview: string = '';
  blogId: any;
  email: string = '';
  currentUrl: any;
  blogPosts!: any;
  userProfilePic!: string;
  name!: string;
  like: boolean = true;


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private blogService: BlogService, private messageService: MessageService, private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.createNewBlogForm();
  }

  ngOnInit(): void {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.authService.getProfile().subscribe((profile) => {
      this.email = profile.user?.email;
      // this.name = profile.user?.name;
    });
    this.getAllBlogs();
  }

  createNewBlogForm() {
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(320),
        Validators.minLength(3)
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(3)
      ])],
      image: [null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }],
    })
  };


  reloadBlogs() {
    this.loadingBlogs = true;
    // Get All Blogs
    this.getAllBlogs();

    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000)
  }
  newBlogForm() {
    this.newPost = true;
  }

  onBlogSubmit() {
    this.processing = true;
    this.disableNewBlogForm();

    // const blog = {
    //   email: this.blogForm.get('title')?.value, 
    //   password: this.blogForm.get('body')?.value,
    //   profilePic: this.blogForm.get('image')?.value,
    //   createdBy: this.email
    // }

    this.blogService.newBlog(this.blogForm.value.title, this.blogForm.value.body, this.blogForm.value.image, this.email).subscribe(
      {
        next: (data) => {
          if (!data.success) {
            this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
            this.processing = false;
            this.enableNewBlogForm();
          } else {

            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
            this.getAllBlogs();
            setTimeout(() => {
              this.router.navigate(['/blog']);
              this.processing = false;
              this.newPost = false;
              this.blogForm.reset();
              this.enableNewBlogForm();
            }, 2500);
            //   timer(2000).toPromise().then(done => {
            //     this.location.back();
            //   })
          }

        }
      }
    );
  }

  onImagePicked(event: Event) {
    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    // const file = (event.target as HTMLInputElement).files;
    this.blogForm.patchValue({ image: file });
    this.blogForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  goBack() {
    // window.location.reload();
    this.router.navigate(['/blog'])
  }

  enableNewBlogForm() {
    this.blogForm.controls['title'].enable();
    this.blogForm.controls['image'].enable();
    this.blogForm.controls['body'].enable();

  };

  disableNewBlogForm() {
    this.blogForm.controls['title'].disable();
    this.blogForm.controls['image'].disable();
    this.blogForm.controls['body'].disable();
  };

  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => {
        this.blogPosts = data.blogs;
        this.blogPosts.map((blogPost: any) => {
          this.blogId = blogPost._id
        })
      }
    });
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.userProfilePic = data.user?.profilePicPath;
      }
    })
  };

  likeBlog(id: string) {
    this.like = true;
    this.blogService.likeBlog(id).subscribe(() => {
      this.getAllBlogs();
    })
  }
  dislikeBlog(id: string) {
    this.blogService.dislikeBlog(id).subscribe(() => {
      this.getAllBlogs();
    })
  }

  deleteBlog(id: string) {
    this.processing = true;
    console.log(id);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this blog?',
      header: 'Delete Blog',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.blogService.deleteBlog(id).subscribe(
          {
            next: (data) => {
              if (!data.success) {
                this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
                this.processing = false;
              } else {
                this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
                setTimeout(() => {
                  this.router.navigate(['/home']);
                }, 1000)
              }
            }
          }
        );
      },
      reject: () => { }
    });

  }





}
