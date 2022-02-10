
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {


  processing = false;
  blog: any = {};
  currentUrl!: any;
  loading: boolean = true;


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private blogService: BlogService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe((data) => {
      if (!data.success) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
        this.processing = false;
      } else {
        // this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
        this.blog = data.blog;
        this.loading = false;
      }
    });
  }

  updateBlogSubmit() {
    this.processing = true;
    // this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.editBlog(this.blog).subscribe((data) => {
      if (!data.success) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
        this.processing = false;

      } else {
        this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000)
      }
    });

  }

  goBack() {
    this.router.navigate(['/blog']);

  }

}
