import { Routes } from '@angular/router';
import { rolGuard } from './guardias/rol.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { AccesoComponent } from './components/acceso/acceso.component';
import { PanelUsuarioComponent } from './components/panel-usuario/panel-usuario.component';
import { PanelAdministradorComponent } from './components/panel-administrador/panel-administrador.component';
import { PanelMedicoComponent } from './components/panel-medico/panel-medico.component';

export const rutas: Routes = [
  { path: '', component: InicioComponent },

  { path: 'acceso', component: AccesoComponent, data: { modo: 'publico' } },
  { path: 'acceso-personal', component: AccesoComponent, data: { modo: 'personal' } },

  { path: 'paciente', component: PanelUsuarioComponent, canActivate: [rolGuard(['paciente'])] },
  { path: 'administrador', component: PanelAdministradorComponent, canActivate: [rolGuard(['administrador'])] },
  { path: 'medico', component: PanelMedicoComponent, canActivate: [rolGuard(['medico'])] },

  { path: '**', redirectTo: '' },
];