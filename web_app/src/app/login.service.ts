import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import * as globalVars from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): Observable<boolean> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<boolean>(globalVars.serverUrl + '/authenticate', JSON.stringify({
      'username': username,
      'password': password
    }), httpOptions).pipe(
      catchError((error) => {
        return throwError(() => new Error('[Error] Login failed:' + error.message));
      })
    );
  }
}
