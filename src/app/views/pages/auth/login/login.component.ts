import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  @ViewChild('documentNumber')
  public documentNumber!:ElementRef<HTMLInputElement>;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoggedin(e: Event) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate([this.returnUrl]);
    }
  }


  validateLenght(e:Event){

    
    if(this.documentNumber.nativeElement.value.length >= 11){
      e.preventDefault;
      this.documentNumber.nativeElement.value = this.documentNumber.nativeElement.value.substring(0,10);
    }
    
  }

}
