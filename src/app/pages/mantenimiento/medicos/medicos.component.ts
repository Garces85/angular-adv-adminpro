import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription | undefined;

  constructor( private medicoService : MedicoService,
                private modalImagenService : ModalImagenService,
                private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarMedicos() );
  }

  ngOnDestroy(){
    this.imgSubs?.unsubscribe;
  }

  buscar ( termino: string ){
    if (termino.length === 0){
      return this.cargarMedicos();
   }
   this.busquedasService.buscarMedicos( 'medicos', termino )
       .subscribe( resp => {

         this.medicos = resp;

       });
  }

  cargarMedicos(){

    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        console.log(medicos);
      })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal( 'medicos', medico._id,  medico.img);
  }

  borrarMedico( medico: Medico ) {
  
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta apunto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'si borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
      this.medicoService.borrarMedico( medico._id )
        .subscribe( resp =>{
          this.cargarMedicos();
          Swal.fire(
            'Medico borrado',
            `${ medico.nombre } fue eliminado correctamente`,
            'success'
        );
        });
      }
    })
  }

}
