import { Injectable } from "@angular/core";
import { map, Observable, throwError } from "rxjs";
import { ConfigService } from "services/config.service";
import { SharedService } from "services/shared.service";
import { RequestResult } from "src/app/models/request-result";


@Injectable({
  providedIn: 'root'
})
export class ResolveRequestResultService {

  private urlApi: string;

  constructor(
    private sharedService: SharedService,
    private configService: ConfigService) {
    this.urlApi = this.configService.config.urlApi;
    this.handleError = this.handleError.bind(this)
  }

  /**
  * Validacion Objeto RequestResult
  * @param {*} requestResult 
  */
  resolve<T>(requestResult: RequestResult<T>) {
    try {
      if (requestResult.isError) {
        this.sharedService.error(requestResult.errorMessage);
        // console.error('[Service]', requestResult.errorMessage);
        // return throwError(requestResult.errorMessage);
        throw new Error(requestResult.errorMessage);
      }
      if (!requestResult.isSuccessful) {
        this.sharedService.warning(requestResult.messages[0]);
        /* console.error('[Service]', requestResult.messages); */
        // return throwError(requestResult.messages[0]);
        throw new Error(requestResult.messages[0]);
      }
      return requestResult.result;

    } catch (error:any) {
      // console.error('[Service]', error);
      throw new Error(`[Service] ${error.message}`);
    }
  }

  /**
* Validacion Objeto RequestResult mas loading
* @param {*} requestResult 
*/
  resolveWithLoading<T>(obs: Observable<RequestResult<T>>) {
    this.sharedService.showLoader(true)
    return obs.pipe(map((response) => {
      this.sharedService.showLoader(false)
      return this.resolve(response);
    }));
  }

  handleError(error: string | string[]) {
    this.sharedService.showLoader(false)
    // console.error(error);

    // let errorMessage = '';
    // if (error.error instanceof ErrorEvent) {
    //   // Get client-side error
    //   errorMessage = error.error.message;
    // } else {
    //   // Get server-side error
    //   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    // }
    this.sharedService.error(error)
    return throwError(error);
  }

}
