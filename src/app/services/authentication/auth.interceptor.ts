import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

const TOKEN_HEADER_KEY = "Authorization";

const addTokenHeader = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    headers: request.headers.set(TOKEN_HEADER_KEY, token),
  });
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  let authReq = req;
  const token = localStorage.getItem("token");

  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {

    
      if (err.status === 401 || err.status === 403) {

        localStorage.clear();

        router.navigateByUrl('/auth/sign-in'); 
      }

      return throwError(() => err);
    })
  );
};