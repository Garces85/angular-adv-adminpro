import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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

  logout(){
    localStorage.removeItem('token');
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

        localStorage.setItem('token', resp.token );
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
        localStorage.setItem('token', resp.token)
      })
      )
    }

    actualizarPerfil( data: { email: string, nombre:string, role?: string } ) {

      data = {
        ...data,
        role: this.usuario.role
      };
      return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, {  headers: {
        'x-token': this.token
      }});
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ base_url }/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                )
  }

  loginGoogle( token: any ) {
    return this.http.post(`${ base_url }/login/google`, { token })
                .pipe(
                  tap((resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                )
  }

  cargarUsuarios( desde: number = 0){

    const url = `${ base_url }/usuarios?desde=${ desde }`;

      return this.http.get( url );
  }
}
