import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, throwError, catchError } from 'rxjs';
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
  // console.log('auth interceptor...');
  const http = inject(HttpClient);
  const authService = inject(AuthService);
  const router = inject(Router);

  let authReq = req;
  const token = localStorage.getItem("token");

  if (token != null) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400 && !refresh) {
        refresh = true;

        const refres = localStorage.getItem("refreshToken");
        const ref = {
          refreshToken: refres,
        };
        // Handle refresh token logic here...
      }

      refresh = false;
      return throwError(err.status);
    })
  );
};

let refresh = false;
