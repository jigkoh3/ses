import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url.toString().indexOf("(") > -1 && request.url.toString().indexOf("('") == -1) {

            request = request.clone({
                url: request.url.replace("(", "('").replace(")", "')")
            });
        }
        console.log(request);
        return next.handle(request);

    }
}