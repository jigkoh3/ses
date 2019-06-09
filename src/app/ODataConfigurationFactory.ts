
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ODataConfiguration } from 'angular-odata-es5/angularODataConfiguration';

export class ODataConfigurationFactory {

    constructor () {
        var currentUser = JSON.parse(localStorage.getItem('SEScurrentUser'));
        const config = new ODataConfiguration();
        //const myconfig = <MyODataConfiguration>config;
        config.baseUrl = environment.serviceUrl;
        config.postHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + (currentUser?currentUser.token:""), 'Content-Type': 'application/json; charset=utf-8' });
        return config;
    }
}