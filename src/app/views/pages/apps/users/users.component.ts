import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Permisos, Roles, Users } from './model/user';
import { UserService } from './services/user.service';
import { RequestResultPHP } from '../../../../models/request-result';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public userCreated: boolean = false;
  selectedRole: string;
  selectedState: string;
  public documentUserSelected: string;
  public roles:Roles[] = [];
  public permisos:Permisos[] = [];

  public users: Users = {
    id: '',
    documento: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: '',
    confirm_password: '',
    rol: '',
    is_active: '',
    created_at: ''
  };

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { this.getRoles(); }

  ngOnInit(): void {
  }

  cleanForm(){

    this.selectedRole = this.roles[0].id_rol;
    this.selectedState = 'Activo';
    this.userCreated = false;
    this.users = {
      id: '',
      documento: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      email: '',
      password: '',
      confirm_password: '',
      rol: '',
      is_active: '',
      created_at: ''
    };
  }

  getUser(document: string): void{

    if(document == undefined)
      this.toastr.warning("El numero de documento es obligatorio.");
    else
      this.userService.getUserByDocument(document)
      .subscribe((data:RequestResultPHP<Users>) => {

        if(data.success == "1"){
          this.toastr.success(data.message);

          this.users =  {
            id: data.result[0].id,
            documento: data.result[0].documento,
            nombres: data.result[0].nombres,
            apellidos: data.result[0].apellidos,
            telefono: data.result[0].telefono,
            email: data.result[0].email,
            password: data.result[0].password,
            confirm_password: data.result[0].password,
            rol: data.result[0].rol,
            is_active: data.result[0].is_active,
            created_at: data.result[0].created_at
          };
          
          // Buscar el objeto de rol correspondiente en this.roles
          this.selectedRole =  data.result[0].rol;
          this.selectedState = data.result[0].is_active == "1" ? "Activo" : "Inactivo";
          //Seteamos el documento del usuario buscado
          this.userService.setUserSelected(this.users.documento);
          this.userCreated = true;
        }
        else{
          this.toastr.error(data.message);
          this.cleanForm();
        }
      });
  }

  getRoles(){

    this.userService.getRoles().subscribe((data: RequestResultPHP<Roles>) => {

      if(data.success == "1"){
        this.toastr.success(data.message);
        this.roles =[
          {
            id_rol: "0",
            rol: "Selecciona un rol"
          }
        ]
        this.roles = this.roles.concat(Object.values(data.result));

        // Establecer el primer elemento como la opción predeterminada
        if (this.roles.length > 0) {
          this.selectedRole = this.roles[0].id_rol;
        }
      }
      else{
        this.toastr.error(data.message);
      }
    });     
  }

  setUser(e:Event){
    e.preventDefault();
       this.users.rol = this.selectedRole;
       this.users.is_active = this.selectedState;
      this.userService.setUser(this.users).subscribe(
        (response: RequestResultPHP<Users>) => {
          if(response.success == "1" || response.success == "2")
            this.toastr.success(response.message);
          else
            this.toastr.warning(response.message);
          
        },
        (error) => {
          console.error(error);
          this.toastr.error('Error al guardar la información. Intente nuevamente.');
        }
      );
    
    return false;
  }

  validateUser(user: Users){
    
    if(user.documento == ""){
      this.toastr.warning("El documento es obligatorio.");
      return false;
    }

    if(user.nombres == ""){
      this.toastr.warning("El nombre es obligatorio.");
      return false;
    }

    if(user.apellidos == ""){
      this.toastr.warning("El apellido es obligatorio.");
      return false;
    }

    if(user.password == ""){
      this.toastr.warning("El password es obligatorio.");
      return false;
    }

    if(user.confirm_password == ""){
      this.toastr.warning("Confirmar password es obligatorio.");
      return false;
    }

    if(this.selectedRole == "0"){
      this.toastr.warning("El rol es obligatorio.");
      return false;
    }

    return true;
  }

}
