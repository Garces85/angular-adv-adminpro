import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService,
              private fileUploadService: FileUploadService ) {}

    ngOnInit(): void {
    }

    cerrarModal(){
      this.imgTemp = null;
      this.modalImagenService.cerrarModal();
    }

    cambiarImagen(evt: any) {

      if(evt?.target?.files[0]){
        this.imagenSubir = evt?.target?.files[0];
        console.log(this.imagenSubir);
      if ( !evt ) {
        this.imgTemp = null;
        return;
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL( this.imagenSubir);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
    .actualizarFoto( this.imagenSubir, tipo, id)
    .then( img => {

      Swal.fire('Guardado', 'Imagen de prefil guardada', 'success');
      this.modalImagenService.nuevaImagen.emit(img);
      this.cerrarModal();
    }).catch( err => {
      console.log(err);
    });

  }

  }
