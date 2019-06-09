import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import 'rxjs/add/operator/catch';
import { ODataConfiguration, ODataExecReturnType, ODataPagedResult, ODataQuery, ODataService, ODataServiceFactory } from 'angular-odata-es5'

import { Router, ActivatedRoute } from '@angular/router';
import { user } from '../../shared/models'
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthenticationService {

  public token: string;
  public userProfile: user;
  //private odata: ODataService<user>;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // set token if saved in local storage

    var currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    this.token = currentUser ? currentUser.token : null;
    this.userProfile = currentUser ? currentUser.user : null;
  }

  login(username: string, password: string): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    ;
    return this.http.post(environment.serviceUrl + '/api/authen', JSON.stringify({ Username: username, Password: password }), httpOptions)
      .pipe(map((response: Response) => {
        //login successful if there's a jwt token in the response
        
        let token = response.toString();
        if (token) {
          // set token property
          this.token = token;
          this.userProfile =
            {
              id: null,
              name: username,
              username: username,
              password: null
            };
          localStorage.setItem('SEScurrentUser', JSON.stringify({ user: this.userProfile, token: token }));
          var currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
          this.token = currentUser ? currentUser.token : null;
          console.log("new token:" + this.token);
          localStorage.setItem('SESisLoggedin', 'true');
          // store username and jwt token in local storage to keep user logged in between page refreshes
          // let filterOData: string[];
          // filterOData.push("Username eq '" + username + "'")
          return true;
          // return true to indicate successful login
        } else {
          // return false to indicate failed login
          localStorage.setItem('SESisLoggedin', 'false');
          return false;
        }
      },error=>{
        if (error.status == 401){
          localStorage.setItem('SESisLoggedin', 'false');
          throw "Username or password is incorrect!";
        }else  if (error.status == 400){
          localStorage.setItem('SESisLoggedin', 'false');
          throw error.statusText;
        }
      }))
  }


  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('SEScurrentUser');
    localStorage.setItem('SESisLoggedin', 'false');
  }

}
