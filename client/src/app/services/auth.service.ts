import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
// import { environment } from 'src/environments/environment';
import { LoginUser } from '../models/loginUser';
// import { RegisterUser } from '../models/registerUser';
import { JwtHelperService } from "@auth0/angular-jwt";
// import { EmailValidator } from '@angular/forms';

const BACKEND_URL = environment.apiUrl + '/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken!: string | null;
  user!: object | null;



  constructor(private http: HttpClient) { }

  registerUser(name: string, branch: string, year: string, email: string, password: string, profilePic: string) {
    const userData = new FormData();
    userData.append("name", name);
    userData.append("branch", branch);
    userData.append("year", year);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("profilePic", profilePic, email);
    return this.http.post<{ success: boolean, message: string, token: string, userEmail: object, user: object }>(BACKEND_URL + '/register', userData);
  }

  checkEmail(email: string) {
    return this.http.get<{ success: boolean, message: string }>(BACKEND_URL + '/checkEmail/' + email);
  }

  loginUser(email: string, password: string) {
    const loginUser: LoginUser = { email: email, password: password };
    return this.http.post<{ success: boolean, message: string, token: string, user: object }>(BACKEND_URL + '/login', loginUser);
  }

  logoutUser() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

  }
  storeUserData(token: string, user: object) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;


  };

  getProfile() {
    return this.http.get<{ success: boolean, message: string, user: { _id: string, name: string, branch: string, year: string, email: string, profilePicPath: string } }>(BACKEND_URL + '/profile');
  }

  editProfile(user: object) {
    return this.http.put<{ success: boolean, message: string }>(BACKEND_URL + '/updateProfile', user);
  }

  deleteProfile() {
    return this.http.delete<{ success: Boolean, message: string }>(BACKEND_URL + '/deleteProfile');
  }


  getPublicProfile(email: string) {
    return this.http.get<{ success: boolean, message: string, user: object }>(BACKEND_URL + '/publicProfile/' + email);
  }
  // { email: string, profilePicPath: string }

  getAllUsers() {
    return this.http.get<{ success: boolean, message: string, user: object }>(BACKEND_URL + '/allUsers');
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
    return this.authToken;
  }

  loggedIn() {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(this.authToken as string);
    const expirationDate = helper.getTokenExpirationDate(this.authToken as string);

    const isExpired = helper.isTokenExpired(this.authToken as string);
    // return this.authService.loadToken();
    // this.authService.logoutUser();

    return isExpired;
  };


}
