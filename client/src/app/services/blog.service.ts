import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectId } from 'mongoose';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';
import { Blog } from '../models/blog';

const BACKEND_URL = environment.apiUrl + '/blogs';
@Injectable({
  providedIn: 'root'
})

export class BlogService {

  constructor(private http: HttpClient) { }


  newBlog(title: string, body: string, image: File, createdBy: string) {
    const blogData = new FormData();
    blogData.append("title", title);
    blogData.append("body", body);
    blogData.append("image", image, title);
    blogData.append("createdBy", createdBy)
    return this.http.post<{ success: boolean, message: string }>(BACKEND_URL + '/newBlog', blogData);
  };

  getAllBlogs() {
    return this.http.get<{ success: boolean, blogs: Array<Blog> }>(BACKEND_URL + '/allBlogs');
  }

  getSingleBlog(id: string) {
    return this.http.get<{ success: boolean, blog: object, message: string }>(BACKEND_URL + '/singleBlog/' + id);
  }

  editBlog(blog: object) {
    return this.http.put<{ success: boolean, message: string }>(BACKEND_URL + '/updateBlog', blog);
  }

  deleteBlog(id: string) {
    return this.http.delete<{ success: boolean, message: string, blog: object }>(BACKEND_URL + '/deleteBlog/' + id);
  }

  likeBlog(id: string) {
    const blogData = { id: id };
    return this.http.put(BACKEND_URL + '/likeBlog/', blogData);
  }

  dislikeBlog(id: string) {
    const blogData = { id: id };
    return this.http.put(BACKEND_URL + '/dislikeBlog/', blogData);
  }


}