import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdmissionComponent } from './components/admission/admission.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { BlogComponent } from './components/blog/blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { HomeComponent } from './components/home/home.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { PracticeComponent } from './components/practice/practice.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'loda', component: PracticeComponent },
  { path: 'admission', component: AdmissionComponent },
  { path: 'edit-blog/:id', component: EditBlogComponent, canActivate: [AuthGuard] },
  { path: 'delete-blog/:id', component: DeleteBlogComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/:email', component: PublicProfileComponent, canActivate: [AuthGuard] },
  { path: 'edit-profile/:email', component: EditProfileComponent, canActivate: [AuthGuard] },
  // { path: 'delete-user/:email', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
