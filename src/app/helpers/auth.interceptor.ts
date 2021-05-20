import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = sessionStorage.getItem('ACCESS_TOKEN');

        if (!token) {
            return next.handle(req);
        }

        const headers = new HttpHeaders({
            'Authorization': token,
            'Content-Type': 'application/json'
        });
    
    
        const cloneReq = req.clone({headers});

        return next.handle(cloneReq);
    }
}