import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment';

@Injectable()
export class MasterService {
    //, public storage: AngularFireStorage
    constructor(private http: HttpClient) {

    }

    getRunning(type: string,group_factory: string): Observable<string> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),

        };

        let params = new HttpParams();
        params = params.append('type', type);
        params = params.append('group_factory', group_factory);
        return this.http.get(environment.serviceUrl + '/api/running', { params: params })
            .pipe(
                map((response: Response) => {
                    //login successful if there's a jwt token in the response

                    return response.toString();
                }
                )
            ).catch(e => {
                return "";
            });
    }
}