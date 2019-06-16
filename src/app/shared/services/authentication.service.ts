import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import 'rxjs/add/operator/catch';

import { Router, ActivatedRoute } from '@angular/router';
import { user, post_auth, user_data, auth_role } from '../../shared/models'
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthenticationService {

  public token: string;
  public userProfile: user_data;
  //private odata: ODataService<user>;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // set token if saved in local storage


  }

  login(username: string, password: string): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(environment.serviceUrl + '/api/authen', JSON.stringify({ Username: username, Password: password }), httpOptions)
      .pipe(map((user: user) => {
        //login successful if there's a jwt token in the response

        //let token = response.toString();
        if (user.status == "Succeed") {
          // set token property
          this.token = user.token;
          this.userProfile = user.data[0];
          // {
          //   id: null,
          //   name: username,
          //   username: username,
          //   password: null
          // };
          localStorage.setItem('SEScurrentUser', JSON.stringify({ user: this.userProfile, token: user.token, role: null }));
          //var currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
          //this.token = currentUser ? currentUser.token : null;
          //console.log("new token:" + this.token);
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
      }, error => {
        if (error.status == 401) {
          localStorage.setItem('SESisLoggedin', 'false');
          throw "Username or password is incorrect!";
        } else if (error.status == 400) {
          localStorage.setItem('SESisLoggedin', 'false');
          throw error.statusText;
        }
      }))
  }

  getRoleMenu() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
    //this.token = currentUser ? currentUser.token : null;
    var user = currentUser ? currentUser.user : null;
    var post_auth: post_auth = {
      application_code : "SES",
      employee_id: user.employee_id,
      employee_username: user.employee_username,
    };
    // post_auth.application_code = "SES";
    // post_auth.employee_id = user.employee_id;
    // post_auth.employee_username = user.employee_username;

    return this.http.post(environment.serviceUrl + '/api/rolemenu', JSON.stringify(post_auth), httpOptions)
      .pipe(map((auth_role: auth_role) => {

        //this.token = user.token;
        //this.userProfile = user;

        

        auth_role.auth_role_menu.push({
          "role_id": 28,
          "application_id": 10,
          "menu_id": 66,
          "menu_name": "pricing-hi-raw",
          "menu_url": "pricing-hi-raw",
          "menu_sequence": 0,
          "menu_sub": 0,
          "menu_icon": "fa flaticon-notes"
        });

        localStorage.setItem('SEScurrentUser', JSON.stringify({ user: user, token: currentUser.token, role: auth_role }));

        return true;
      }, error => {
        if (error.status == 401) {
          localStorage.setItem('SESisLoggedin', 'false');
          throw "Session expired!";
        } else if (error.status == 400) {
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
