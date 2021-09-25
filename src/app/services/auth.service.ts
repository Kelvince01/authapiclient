import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { RouterModule, Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private url = "http://127.0.0.1:8000/api"

  constructor(private http: HttpClient, public router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
  }

  // method of requesting to the backend for a token
  tokenGen(userData): Observable<any> {
    var headersForTokenApi = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    var data = "grant_type=password&username=" + userData.useremail + "&password=" + userData.userpass;
    return this.http.post(`${this.url}/token`, data, { headers: headersForTokenApi });
  }

  refreshToken() {
    return this.http.post<any>(`${this.url}/refresh-token`, {}, { withCredentials: true })
        .pipe(map((account) => {
            this.currentUserSubject.next(account);
            this.startRefreshTokenTimer();
            return account;
        }));
  }

  // helper methods
  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
      // parse json object from base64 encoded jwt token
      //const jwtToken = JSON.parse(atob(this.currentUserValue.jwtToken.split('.')[1]));

      // set a timeout to refresh the token a minute before it expires
      //const expires = new Date(jwtToken.exp * 1000);
      //const timeout = expires.getTime() - Date.now() - (60 * 1000);
      //this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
      clearTimeout(this.refreshTokenTimeout);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // service of regestering a user (client)
  register(user: User) {
    return this.http.post(`${this.url}/signup`, user, httpOptions);
  }

  login(email, password) {
    return this.http.post<any>(`${this.url}/login`, { email, password }, httpOptions)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
    }));
  }

  forgot_password(email) {
    return this.http.post(`${this.url}/password/reset/`, { email }, httpOptions);
  }

  verify_email(token: string) {
    return this.http.post(`${this.url}/verify-email`, { token });
  }

  validate_reset_token(token: string) {
      return this.http.post(`${this.url}/validate-reset-token`, { token });
  }

  reset_password(token: string, password: string, confirmPassword: string) {
      return this.http.post(`${this.url}/reset-password`, { token, password, confirmPassword });
  }

  // service of retrieving all user (admin/clients/customer)
  getAllUser(): Observable<any> {
    return this.http.get(this.url);
  }
  // service of updating a user details (admin/clients/customer)
  updateUser(user) {
    //this.http.put(`${this.url}/update` + '/' + user.userid, user).subscribe(data => {
    this.http.put(`${this.url}/update`, user).subscribe(data => {
      // console.log(data);
    }, err => {
      console.log(err);
      alert('Http Error: ' + err.message);
    }, () => {
      console.log("user updated successfully");
    })
  }

  // service of deleting a user (admin/clients/customer)
  deleteUser(username) {
    return this.http.delete(this.url + '/' + username);
  }

  //service to logout from the system
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    alert("Logged out successfully");
    this.router.navigate(['/login']);

    /*this.http.post<any>(`${this.url}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);*/

    location.reload();
  }
}
