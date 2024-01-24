import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LoginData } from '../../pages/auth/model/auth';
import { LoginService } from '../../pages/auth/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public userInfo: LoginData;

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getInfoUser();
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    localStorage.removeItem('isLoggedin');

    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

  getInfoUser(){
    this.loginService.getUserInfo().subscribe(
      (data: LoginData | null) => {
        if (data) {
          this.userInfo = data;
          
        } else {
          this.userInfo = {
            id_user: "0",
            documento: "0",
            nombres: "",
            apellidos: "",
            telefono: "",
            email: "",
            is_active: "",
            rol: "",
            created_at: "",
          }
        }
      },
      (error) => {
        this.toastr.error("Error al obtener información del usuario: " + error)
      }
    );
  }

}
