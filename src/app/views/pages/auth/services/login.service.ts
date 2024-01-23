import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry, throwError } from 'rxjs';
import { ConfigService } from 'services/config.service';
import { SharedService } from 'services/shared.service';
import { RequestResult } from 'src/app/models/request-result';
import { ResolveRequestResultService } from 'utils/resolve-requestResult';
import { LoginData } from '../model/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

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
    body.set('pass', pass);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<LoginData>(
        `${this.configService?.config?.urlApi}login.php`,
        body.toString(), // Envía los datos en el formato application/x-www-form-urlencoded
        { headers: headers }
      )
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          this.sharedService.showLoader(false);
          return response;
        })
      );
  }
  
}
