import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(  private fb: FormBuilder,
                private usuarioService : UsuarioService,
                private fileUploadService: FileUploadService ) {

    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required ],
      email: [ this.usuario.email, [Validators.required, Validators.email] ],
    });
  }

  actualizarPerfil() {

    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( resp =>  {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
      }, (err: any) => {
        console.log(err.error.msg);

        Swal.fire('Error no', err.error.msg, 'error');
      });
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
    console.log( this.usuario.uid);

    this.fileUploadService
    .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid!)
    .then( img => {
      this.usuario.img = img

      Swal.fire('Guardado', 'Imagen de prefil guardada', 'success');
    }).catch( err => {
      console.log(err);
    });

  }
}
