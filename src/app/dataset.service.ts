import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HeadlineDOM } from './HeadlineDOM';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  serverUrl: string = "http://127.0.0.1:5000/";

  constructor(private http: HttpClient) { }

  getHeadlineData(inputSrNo: number): Observable<string> {

    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    let params = new HttpParams().append('srno', inputSrNo)

    return this.http.get<string>(this.serverUrl + '/headline', { headers, params }).pipe(
      catchError((error) => {
        return throwError(() => new Error('[Error] Fetching headline data: ' + error.message));
      })
    );
  }

  getAnnotateData(srNo: number): Observable<string> {
    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    let params = new HttpParams().append('srno', srNo)
    return this.http.get<string>(this.serverUrl + '/annotate', { headers, params }).pipe(
      catchError((error) => {
        return throwError(() => new Error('[Error] Fetching annotate data: ' + error.message));
      })
    );
  }

  getValidateData(srNo: number): Observable<string> {
    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    let params = new HttpParams().append('srno', srNo)
    return this.http.get<string>(this.serverUrl + '/validate', { headers, params }).pipe(
      catchError((error) => {
        return throwError(() => new Error('[Error] Fetching validate data: ' + error.message));
      })
    );
  }

  submitAnnotateData(srno: number, edit_state: string, distortion_category: string, dist_text: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<string>(this.serverUrl + '/annotate', JSON.stringify(
      {
        'srno': srno,
        'userid': 'jerin.john', //TODO
        'edit_state': edit_state,
        'distortion_category': distortion_category,
        'dist_text': dist_text
      }), httpOptions).pipe(
        catchError(error => {
          return throwError(() => new Error('[Error] Submitting annotate data: ' + error.message));
        })
      );;
  }

  editAnnotateData(srno: number, edit_state: string, dist_idx:number, dist_text: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<string>(this.serverUrl + '/annotate', JSON.stringify(
      {
        'srno': srno,
        'userid': 'jerin.john', //TODO
        'edit_state': edit_state,
        'idx': dist_idx,
        'dist_text': dist_text
      }), httpOptions).pipe(
        catchError(error => {
          return throwError(() => new Error('[Error] Editing annotate data: ' + error.message));
        })
      );;
  }

  submitValidateData(srno: number, edit_state: string, dist_idx:number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<string>(this.serverUrl + '/validate', JSON.stringify(
      {
        'srno': srno,
        'edit_state': edit_state,
        'idx': dist_idx,
      }), httpOptions).pipe(
        catchError(error => {
          return throwError(() => new Error('[Error] Validating annotate data: ' + error.message));
        })
      );;  }

  // private handleError(error: any) {
  //   console.error('Error occurred', error);
  //   return Observable.(error.json().error || 'Server Error');
  // }

}
