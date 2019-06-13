import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/shared';
import * as moment from 'moment';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [AuthenticationService]
})
export class LoginComponent implements OnInit {
    @ViewChild('formData') form: NgForm;
    loginForm: FormGroup;
    
    alert;
    retPath;
    retUrl;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private router: Router, private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.authenticationService.logout();
        this.loginForm = this._formBuilder.group({
            user: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.route.queryParams.subscribe
            (params => {
                this.alert = params['error'] ? params['error'] : null;
                this.retPath = params['retPath'] ? params['retPath'] : null;
                this.retUrl = params['retUrl'] ? params['retUrl'] : null;
            });
    }
    onLoggedin(formData) {
        // this.route.queryParams.subscribe
        // (params => {


        // });
        //this.loading = true;
        if (formData.valid) {
            this.authenticationService.login(formData.value.user, formData.value.password)
                .subscribe(result => {
                    if (result === true) {
                        // login successful
                        this.authenticationService.getRoleMenu().subscribe(result =>{
                            
                            localStorage.setItem("SESTimeout", moment().add(4, 'hour').toDate().getTime().toString());
                            if (this.retPath){
                                this.router.navigate(['/' + this.retPath ], { queryParams: { retUrl: this.retUrl?this.retUrl:"" } });
                            }else{
                                this.router.navigate(['/pricing-hi-raw']);
                            }
                        },
                    error => {
                        if (error.status == 401) {
                            localStorage.setItem('SESisLoggedin', 'false');
                            this.alert = "User or password is incorrect!";
                            //
                            // } else if (error.status == 400) {
                            //     localStorage.setItem('SESisLoggedin', 'false');
                            //     this.error = error.statusText;
                        } else if (error.status == 500 || error.status == 400) {
                            localStorage.setItem('SESisLoggedin', 'false');
                            if (error.error.InnerException) {
                                this.alert = error.error.InnerException.ExceptionMessage;
                            } else {
                                this.alert = error.statusText;
                            }
                        } else if (error.status == 0) {
                            localStorage.setItem('SESisLoggedin', 'false');
                            this.alert = "Cannot connect to server. Please contact administrater.";
                        } else {
                            this.alert = JSON.stringify(error);
                        }

                    });


                        
                      
                        


                    } else {
                        // login failed
                        this.alert.messageType = "error";
                        this.alert.message = 'Username or password is incorrect!';

                    }
                },
                    error => {
                        if (error.status == 401) {
                            localStorage.setItem('SESisLoggedin', 'false');
                            this.alert = "User or password is incorrect!";
                            //
                            // } else if (error.status == 400) {
                            //     localStorage.setItem('SESisLoggedin', 'false');
                            //     this.error = error.statusText;
                        } else if (error.status == 500 || error.status == 400) {
                            localStorage.setItem('SESisLoggedin', 'false');
                            if (error.error.InnerException) {
                                this.alert = error.error.InnerException.ExceptionMessage;
                            } else {
                                this.alert = error.statusText;
                            }
                        } else if (error.status == 0) {
                            localStorage.setItem('SESisLoggedin', 'false');
                            this.alert = "Cannot connect to server. Please contact administrater.";
                        } else {
                            this.alert = JSON.stringify(error);
                        }

                    });

        } else {
            this.alert = "Please fill user and password!";
        }
    }
}
