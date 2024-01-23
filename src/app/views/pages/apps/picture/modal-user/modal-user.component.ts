import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../model/person';
import { PictureService } from '../services/picture.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() closeModal = new EventEmitter<void>();
  
  constructor(
    private pictureService: PictureService
  ) {}

  ngOnInit(): void {}

  verDetalle(user:User){
    this.pictureService.setSelectedUser(user);
    this.close();    
  }

  close() {
    this.closeModal.emit();
  }
}
