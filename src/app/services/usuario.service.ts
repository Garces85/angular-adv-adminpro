import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario!: Usuario;


  constructor( private http: HttpClient,
                private router: Router,
                private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {

    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  googleInit() {

    //Usamos una promesa ya que siempre se escuchan, lo obsevable hay que susbcribirse
    return new Promise( resolve => {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '1091128753287-01t7b6bb9bperu7kkbif4gfgeoo2of2d.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin'
      });
      resolve(this.auth2);
    });
  });

  }

  guardarLocalStorage( token: string, menu: any){
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.auth2.signOut().then( () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {
    //const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }) .pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, img='', uid } = resp.usuario;

        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      //la autenticacion no es correcta devolvemos false
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${ base_url }/usuarios`, formData)
    .pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
      )
    }

    actualizarPerfil( data: { email: string, nombre:string, role?: string } ) {
      //Extraermos el rol para no actualizarlo
      data = {
        ...data,
        role: this.usuario.role
      }

      return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers );
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                )
  }

  loginGoogle( token: any ) {
    return this.http.post(`${ base_url }/login/google`, { token })
                .pipe(
                  tap((resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                )
  }

  cargarUsuarios( desde: number = 0){

    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
      .pipe(
        //delay(200),
        map( resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
            );
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario( usuario: Usuario){
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers )
  }

  guardarUsuario( usuario: Usuario) {

    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );
}



}
