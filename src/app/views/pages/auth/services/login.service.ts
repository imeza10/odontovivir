import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, retry, throwError } from 'rxjs';
import { ConfigService } from 'services/config.service';
import { SharedService } from 'services/shared.service';
import { RequestResult } from 'src/app/models/request-result';
import { ResolveRequestResultService } from 'utils/resolve-requestResult';
import { LoginData } from '../model/auth';
import { RequestResultPHP } from '../../../../models/request-result';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userInfo: BehaviorSubject<LoginData | null> = new BehaviorSubject<LoginData | null>(null);

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private sharedService: SharedService

  ) {
    this.configService.getAppConfig();
   }

  
  private handleError(error:any) {
    // this.sharedService.showLoader(false);
    console.error(error);
    this.sharedService.error(error);
    return throwError(error);
  }
  
  setLogin(document: string, pass: string) {
    this.sharedService.showLoader(true);
  
    const body = new URLSearchParams();
    body.set('documento', document);
    body.set('password', pass);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<RequestResultPHP<LoginData>>(
        `${this.configService?.config?.urlApi}login.php`,
        body.toString(), // Envía los datos en el formato application/x-www-form-urlencoded
        { headers: headers }
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          this.sharedService.showLoader(false);
          this.setUserInfo(response.result[0]);
          return response;
        })
      );
  }

  setUserInfo(user: LoginData) {
    this.userInfo.next(user);
  }

  getUserInfo(): Observable<LoginData | null> {
    return this.userInfo.asObservable();
  }
  
}
