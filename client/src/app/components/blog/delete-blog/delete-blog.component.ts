import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Blog } from 'src/app/models/blog';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {

  foundBlog: boolean = false;
  processing: boolean = false;

  blog: any;

  currentUrl: any;
  constructor(private blogService: BlogService, private router: Router, private activatedRoute: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe((data) => {
      if (!data.success) {
        this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
      } else {
        this.blog = data.blog;
        // this.blog = {
        //   title : data.blog.title,
        //   body: data.blog.body,
        //   createdBy: data.blog.createdBy,
        //   createdAt: data.blog.createdAt

        // }
        this.foundBlog = true;
      }
    })
  }

  // deleteBlog() {
  //   this.processing = true;
  //   this.blogService.deleteBlog(this.currentUrl.id).subscribe((data) => {
  //     if (!data.success) {
  //       this.messageService.add({ severity: 'error', summary: 'Error Message', detail: data.message });
  //     } else {
  //       this.messageService.add({ severity: 'success', summary: 'Success Message', detail: data.message });

  //       setTimeout(() => {
  //         this.router.navigate(['/blog']);
  //       }, 1000)
  //     }
  //   });
  // }

}
