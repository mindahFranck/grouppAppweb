import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthentificationsService } from '../demo/service/auth.service';

@Injectable()
export class httpsqInterceptor implements HttpInterceptor {
  constructor(private authService: AuthentificationsService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer '+this.authService.token

      }
    });
    return next.handle(request);
  }
}
