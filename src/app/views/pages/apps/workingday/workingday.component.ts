import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'services/shared.service';
import { WorkingDay } from './model/WorkingDay';
import { WorkingdayService } from './services/workingday.service';

@Component({
  selector: 'app-workingday',
  templateUrl: './workingday.component.html',
  styleUrls: ['./workingday.component.scss']
})
export class WorkingdayComponent implements OnInit {

  public loader: boolean = false;
  public workingday: WorkingDay = {
    id_working_day: "",
    working_day: "",
    addAt: "",
    updateAt: "",
    state: ""
  };

  constructor(
    private toastr: ToastrService,
    private sharedService: SharedService,
    private workingService: WorkingdayService) {
      this.sharedService.loader.subscribe((value: boolean) => {
        this.loader = value; // Actualiza el estado del loader cuando cambia el BehaviorSubject
      });
  }

  ngOnInit(): void {
  }

  setWorkinDay(e:Event){

  }


  cleanForm(){
    this.workingday = {
      id_working_day: "",
      working_day: "",
      addAt: "",
      updateAt: "",
      state: ""
    };
  }

}
