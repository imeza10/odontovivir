import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {

  public persona:string = "Estudiante";
  constructor() { }

  ngOnInit(): void {
  }

}
