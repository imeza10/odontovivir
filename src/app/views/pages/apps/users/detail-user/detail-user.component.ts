import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestResultPHP } from 'src/app/models/request-result';
import { Modulos, Permisos, Users } from '../model/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {

  public documento: string;
  public modulos:Modulos[] = [];
  public permisos:Permisos[] = [];
  public permiso: Permisos = {
    id: '0',
    documento: '0',
    id_rol: '0',
    id_modulo: '0',
    asignar: '0',
    guardar: '0',
    actualizar: '0',
    eliminar: '0'

  }
  constructor(
    private userService: UserService,
    private toastr: ToastrService
    ) {
      this.getModulos();
     }

  ngOnInit(): void { }

  getModulos(){

    this.userService.getModulos().subscribe((data: RequestResultPHP<Modulos>) => {

      if(data.success == "1"){
        this.toastr.success(data.message);       
        this.modulos = Object.values(data.result);

        this.userService.getUserSelected().subscribe((documento: String | null) => {
          if (documento){
            this.documento = documento.toString();
            this.userService.getPermisos(documento.toString()).subscribe((data: RequestResultPHP<Permisos>) => {
          
              if(data.success == "1"){
                this.toastr.success(data.message);
                
                this.permisos = Object.values(data.result);

                // Asignar el valor de habilitado en función de la existencia de un permiso
                this.modulos.forEach((modulo) => {
                  modulo.habilitado = this.permisos.some(permiso => permiso.id_modulo === modulo.id_modulo);
                });

              }
              else{
                this.toastr.error(data.message);
              }
            }); 
          }
          
        });

      }
      else{
        this.toastr.error(data.message);
      }
    });
     
  }

  onCheckboxChange(modulo: Modulos){

    this.permiso.documento = this.documento;
    this.permiso.id_rol = modulo.rol;
    this.permiso.id_modulo = modulo.id_modulo;
    this.permiso.asignar = modulo.habilitado ? "1" : "0";
    this.permiso.guardar = "0";
    this.permiso.actualizar = "0";
    this.permiso.eliminar = "0";

    if(modulo){
      this.userService.setPermisos(this.documento, this.permiso).subscribe((data: RequestResultPHP<Permisos>) => {
          
        if(data.success == "1" || data.success == "2"){
          this.toastr.success(data.message);
        }
        else{
          this.toastr.error(data.message);
        }
      }); 
    }
  }

}
