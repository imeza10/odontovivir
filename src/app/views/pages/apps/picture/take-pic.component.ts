import { Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RequestResultSMA, User } from './model/person';
import { PictureService } from './services/picture.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { SharedService } from 'services/shared.service';

@Component({
  selector: 'app-take-pic',
  templateUrl: './take-pic.component.html',
  styleUrls: ['./take-pic.component.scss']
})
export class TakePicComponent implements OnInit {
  public persona:string = "Estudiante";
  public document: string;
  public loader: boolean = false;
  public personIn: boolean = false;

  //URL de la imagen.
  public photoSrc:string;

  response: any = {};

  constructor(
    private pictureService: PictureService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private sharedService: SharedService
    ) {
      this.sharedService.loader.subscribe((value: boolean) => {
        this.loader = value; // Actualiza el estado del loader cuando cambia el BehaviorSubject
      });
     }

  ngOnInit(): void {
    this.pictureService.getSelectedUser().subscribe((user: User | null) => {
      if (user) {
        this.fillForm(user);
      }
    });

    this.pictureService.photoSrc$.subscribe((photoSrc) => {
      this.photoSrc = photoSrc;
    });

  }

  getPerson(document: string) {

    if(document == undefined)
      this.toastr.warning("El numero de documento es obligatorio.");    
    else
      this.pictureService.getPersonSMA(document)
      .subscribe((rest:RequestResultSMA) => {

        if(rest.success == "1"){
          this.toastr.success(rest.message);
          //Si hay mas de un usuario, mostramos el modal
          if(rest.users.length > 1){
            const modalRef = this.openModalUser(ModalUserComponent);
            modalRef.componentInstance.users = rest.users;

            modalRef.componentInstance.closeModal.subscribe(() => {
              // Cerrar el modal cuando se emite el evento closeModal
              modalRef.close();
            });
          }
          else{
            this.fillForm(rest.users[0]);
          }
        }
        else{
          this.toastr.error(rest.message);
          this.cleanForm();
        }
      });
  }

  openModalUser(content: any) {
    
    return this.modalService.open(content, { size: 'xl' }); // Abre el modal
  }

  fillForm(data:User){
    this.personIn = true;
    this.persona = data.type

    this.response = {
      document: data.document,
      name: data.name,
      last_name: data.last_name,
      program: data.program,
      email: data.email,
      type: data.type,
      state: data.state == "A" ? "Activo" : "Inactivo",
      stratum: data.stratum,
      rh: data.rh
    };

    let baseUrl = this.pictureService.getURLBasePhoto();
    let url = this.response.type == "Docente"?  baseUrl+"docentes/": this.response.type == "Funcionario"?baseUrl+"administrativos/" : baseUrl;        
    url += this.response.document.trim()+".png?v="+Math.random();

    this.pictureService.validateURL(url).subscribe(
      isValid => {
        if (isValid) {
          // La URL es válida
          this.photoSrc = url;
        } else {
          // La URL no es válida
          this.photoSrc = "assets/images/user_default.jpg";
        }
        this.pictureService.updatePhotoSrc(this.photoSrc); // Actualizar la URL en el servicio
      }
    );

    //Guardamos o actualizamos la información en BD del sistema y no de SMA...
    this.pictureService.getPersonCarnetizacion(this.response).subscribe(
      (res: User) => {
        if(res.success == "1")
          this.response.rh = res.rh;       
      },
      (error) => {
        console.error(error);
        this.toastr.error('Error al consultar la información de carnetización. Intente nuevamente.');
      }
    );
  }

  cleanForm(){
    this.response = {
      document: "",
      name: "",
      last_name: "",
      program: "",
      email: "",
      type: "",
      state: "",
      stratum: "",
      rh: "Selecciona un tipo de sangre"
    };
    this.personIn = false;
  }

  setImagePerson(e:Event){
    e.preventDefault();

    this.photoSrc;
    if(this.response.document == "")
      return this.toastr.warning("El numero de documento es obligatorio.");
    
    if(this.response.rh == "" || this.response.rh == "Selecciona un tipo de sangre")
      return this.toastr.warning("El tipo de sangre RH es obligatorio.");

      if (this.photoSrc) {
       
        this.pictureService.setImagePerson(this.response, this.photoSrc).subscribe(
          (response: User) => {
            if(response.success == "1")
              this.toastr.success('La foto se guardó con éxito.');
            else
              this.toastr.warning('La foto no se guardó con éxito.');
            
          },
          (error) => {
            console.error(error);
            this.toastr.error('Error al guardar la foto. Intente nuevamente.');
          }
        );

        //Guardamos o actualizamos la información en BD del sistema y no de SMA...
        this.pictureService.setCarnet(this.response).subscribe(
          (res: User) => {
            if(res.success == "1")
              this.toastr.success('Se guardo la información correctamente.');
            else
              this.toastr.warning('No se guardo la información correctamente.');
          },
          (error) => {
            console.error(error);
            this.toastr.error('Error al guardar la información. Intente nuevamente.');
          }
        );
      } else {
        this.toastr.warning('Debe tomar una foto antes de guardar.');
      }
    
    return false;
  }

}
