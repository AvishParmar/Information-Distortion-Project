import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // serverUrl: string = "http://localhost:5000/";
  serverUrl: string = "http://130.245.128.175:5000/";

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): Observable<boolean> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<boolean>(this.serverUrl + '/authenticate', JSON.stringify({
      'username': username,
      'password': password
    }), httpOptions).pipe(
      catchError((error) => {
        return throwError(() => new Error('[Error] Login failed:' + error.message));
      })
    );
  }
}
