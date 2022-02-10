import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.loadToken();
        // const authRequest = req.clone({
        //     setHeaders: {
        //         Authorization: `Bearer ${authToken}`
        //     }
        // });

        const authRequest = !authToken ? req : req.clone({
            setHeaders: { Authorization: `Bearer ${authToken}` }
        });
        return next.handle(authRequest).pipe(
            tap(
                event => { },
                err => {
                    if (err.error.auth == false) {
                        this.router.navigateByUrl('/login');
                    }
                })
        );;

    }
}