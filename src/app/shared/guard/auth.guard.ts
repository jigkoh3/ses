import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('SESisLoggedin')) {
            var currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
            let token = currentUser ? currentUser.token : null;
            let userProfile = currentUser ? currentUser.user : null;
            let timeout = localStorage.getItem("SESTimeout");
            if (timeout) {
                if (parseInt(timeout) <= (new Date).getTime()) {
                    this.router.navigate(['/login']);
                } else {
                    if (token && userProfile) {
                        return true;
                    } else {
                        this.router.navigate(['/login']);
                        return false;
                    }
                }
            }
        }

        this.router.navigate(['/login']);
        return false;
    }
}
