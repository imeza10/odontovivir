import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/person';
import { PictureService } from '../services/picture.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @ViewChild('videoElement') videoElement: ElementRef;
  
  isCameraOn: boolean = false;
  photoSrc: string = "assets/images/user_default.jpg";
  track: MediaStreamTrack;
  response: User;
  
  videoDevices: MediaDeviceInfo[] = [];
  selectedVideoDevice: MediaDeviceInfo;

  constructor(
    private pictureService: PictureService) { }

  ngOnInit(): void {
    this.pictureService.photoSrc$.subscribe((url) => {
      this.photoSrc = url;
    });

    // Obtener la lista de dispositivos multimedia al iniciar el componente
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.videoDevices = devices.filter(device => device.kind === 'videoinput');
      // Seleccionar la primera cámara por defecto
      this.selectedVideoDevice = this.videoDevices[0];
    });    
  }
  
  startCamera() {
    this.isCameraOn = true;

    // Solicitar acceso a la cámara
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });
  }

  switchCamera(e:Event){
    e.preventDefault();
    // Cambiar a la siguiente cámara en la lista
    const currentIndex = this.videoDevices.findIndex(device => device.deviceId === this.selectedVideoDevice.deviceId);
    const nextIndex = (currentIndex + 1) % this.videoDevices.length;
    this.selectedVideoDevice = this.videoDevices[nextIndex];

    // Reiniciar la cámara con la nueva selección
    this.stopCamera();
    this.startCamera();
  }

  takePhoto() {
    // Capturar la foto del video
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = this.videoElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // canvas.width = 10;
    // canvas.height = 15;
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Detener la reproducción del video
    video.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());

    this.isCameraOn = false;
    this.photoSrc = canvas.toDataURL('image/jpeg');
    
    // Guardar la foto en el servicio compartido
    this.pictureService.setPhotoSrc(this.photoSrc);
  }

  stopCamera() {
    this.isCameraOn = false;

    // Detener la reproducción del video
    this.videoElement.nativeElement.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoSrc = e.target.result;
        
        // Guardar la foto en el servicio compartido
        this.pictureService.setPhotoSrc(this.photoSrc);
      };
      reader.readAsDataURL(file);
    }
  }
  
}
