import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }
/* const promesa = new Promise( (resolve, reject) => {

        if ( false ){
          resolve('hola Mundo');
        } else {
          reject('Algo salio mal');
        }
      });

    promesa
    .then(( mensaje ) => {
        console.log(mensaje);
    })
    .catch( error => console.log('Error en mi promesa', error) );
    console.log('Fin del Init'); */

  ngOnInit(): void {
      this.getUsuarios().then( usuarios => {
        console.log(usuarios);
      });
  }

  getUsuarios(){

    return new Promise( resolve => {
      fetch('https://reqres.in/api/users')
        .then( resp => resp.json())
        .then( body => resolve( body.data ));
      });
  }
}




