import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, retry, throwError } from 'rxjs';
import { ConfigService } from 'services/config.service';
import { SharedService } from 'services/shared.service';
import { RequestResultPHP } from 'src/app/models/request-result';
import { Roles, Users, Modulos, Permisos } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loader: boolean = false;
  private selectedUserSubject: BehaviorSubject<String | null> = new BehaviorSubject<String | null>(null);
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private sharedService: SharedService

  ) {
    this.configService.getAppConfig();
   }

  
  private handleError(error:any) {
    this.sharedService.showLoader(false);
    console.error(error);
    this.sharedService.error(error);
    return throwError(error);
  }
  
  getUserByDocument(document: string) {
    this.sharedService.showLoader(true);
  
    const body = new URLSearchParams();
    body.set('documento', document);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<RequestResultPHP<Users>>(`${this.configService?.config?.urlApi}getUsuario.php`,
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

  setUser(user: Users) {
    this.sharedService.showLoader(true);
  
    const body = new URLSearchParams();
    body.set('documento', user.documento);
    body.set('nombres', user.nombres);
    body.set('apellidos', user.apellidos);
    body.set('telefono', user.telefono);
    body.set('email', user.email);
    body.set('password', user.password);
    body.set('rol', user.rol);
    body.set('estado', user.is_active == "Activo" ? "1" : "0");

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<RequestResultPHP<Users>>(`${this.configService?.config?.urlApi}setUsuario.php`,
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

  getRoles() {
    this.sharedService.showLoader(true);
  
    return this.http
      .get<RequestResultPHP<Roles>>(`${this.configService?.config?.urlApi}getRoles.php`,)
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          this.sharedService.showLoader(false);          
          return response;
        })
      );
  }

  getModulos() {
    this.sharedService.showLoader(true);
  
    return this.http
      .get<RequestResultPHP<Modulos>>(`${this.configService?.config?.urlApi}getModulos.php`,)
      .pipe(
        retry(0),
        catchError(this.handleError),
        map((response) => {
          this.sharedService.showLoader(false);          
          return response;
        })
      );
  }

  getPermisos(documento : string) {
    this.sharedService.showLoader(true);
  
    const body = new URLSearchParams();
    body.set('documento', documento);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<RequestResultPHP<Permisos>>(`${this.configService?.config?.urlApi}getPermisos.php`,
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

  setPermisos(documento : string, modulo: Permisos) {
    this.sharedService.showLoader(true);
  
    const body = new URLSearchParams();
    body.set('documento', documento);
    body.set('id_rol', modulo.id_rol);
    body.set('id_modulo', modulo.id_modulo);
    body.set('asignar', modulo.asignar);
    body.set('guardar', modulo.guardar);
    body.set('actualizar', modulo.actualizar);
    body.set('eliminar', modulo.eliminar);

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http
      .post<RequestResultPHP<any>>(`${this.configService?.config?.urlApi}setPermisos.php`,
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

  setUserSelected(documento: string){
    this.selectedUserSubject.next(documento)
  }

  getUserSelected(): Observable<String | null> {
    return this.selectedUserSubject.asObservable();
  }

}
