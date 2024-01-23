import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { LoginData } from '../model/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  @ViewChild('documentNumber')
  public documentNumber!:ElementRef<HTMLInputElement>;

  @ViewChild('password')
  public password!:ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoggedin(e: Event) {
    e.preventDefault();
    let documento = this.documentNumber.nativeElement.value;
    let pass = this.password.nativeElement.value;

    this.loginService.setLogin(documento, pass)
    .subscribe((rest:LoginData) => {

      if(rest.success == "1"){
        this.toastr.success("Bienvenido " + rest.nombres + " " + rest.apellidos);
        localStorage.setItem('isLoggedin', 'true');
        if (localStorage.getItem('isLoggedin')) {
          this.router.navigate([this.returnUrl]);
        }
      }
      else{
        this.toastr.error(rest.message);
      }
    });
  }

  validateLenght(e:Event){
    if(this.documentNumber.nativeElement.value.length >= 11){
      e.preventDefault;
      this.documentNumber.nativeElement.value = this.documentNumber.nativeElement.value.substring(0,10);
    }

  }

}
