import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../../services/shared.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public loader: boolean = false;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.loader.subscribe((value: boolean) => {
      this.loader = value; // Actualiza el estado del loader cuando cambia el BehaviorSubject
    });
  }

}
