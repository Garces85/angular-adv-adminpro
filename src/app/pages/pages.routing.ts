import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

//Mantenimiento
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HospitalesComponent } from './mantenimiento/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimiento/medicos/medicos.component';
import { MedicoComponent } from './mantenimiento/medicos/medico.component';


const routes: Routes = [
  {
    path: 'dashboard', component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent, data: { titulo: 'Dasboard'} },
      { path: 'account-settings', component: AccountSettingsComponent , data: { titulo: 'Ajustes de cuenta'}},
      { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica # 1'} },
      { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de Usuario'} },
      { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress'} },
      { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'}},
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RXJS'}},

      //Mantenimientos
      { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimientos de Usuarios'}},
      { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales'}},
      { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Medicos'}},
      { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de Medicos'}},

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

