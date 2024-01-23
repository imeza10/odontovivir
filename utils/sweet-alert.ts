import Swal from 'sweetalert2';

export class SweetAlert {

    success(text:string, title: string = "") {
        Swal.fire({
          position: 'top-end',
          title: title,
          text: text,
          showConfirmButton: false,
          timer: 1500,
          icon: 'success'
        });
      }
}