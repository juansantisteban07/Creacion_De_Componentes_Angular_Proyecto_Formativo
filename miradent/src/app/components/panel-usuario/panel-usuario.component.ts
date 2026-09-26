import { Component } from '@angular/core';
import { Cita, EstadoCita, FiltroCita } from '../../modelos/modelos';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { CitasService } from '../../servicios/citas.service';
import { BarraNavegacionComponent } from '../compartido/barra-navegacion/barra-navegacion.component';
import { FormularioCitaComponent } from '../compartido/formulario-cita/formulario-cita.component';
import { ListaCitasComponent } from '../compartido/lista-citas/lista-citas.component';

// Panel del paciente: puede agendar citas nuevas, ver las suyas y cancelarlas.
@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [BarraNavegacionComponent, FormularioCitaComponent, ListaCitasComponent],
  templateUrl: './panel-usuario.component.html',
})
export class PanelUsuarioComponent {
  filtro: FiltroCita = 'todas';

  // Opciones que se muestran como botones de filtro
  filtros: { valor: FiltroCita; texto: string }[] = [
    { valor: 'todas', texto: 'Todas' },
    { valor: 'programada', texto: 'Programadas' },
    { valor: 'atendida', texto: 'Atendidas' },
    { valor: 'cancelada', texto: 'Canceladas' },
  ];

  constructor(private auth: AutenticacionService, private citas: CitasService) {}

  get usuario() {
    return this.auth.usuarioActual()!;
  }

  get misCitas(): Cita[] {
    return this.citas.delPaciente(this.usuario.id);
  }

  // Aplica el filtro que el usuario haya elegido
  get citasFiltradas(): Cita[] {
    return this.filtro === 'todas'
      ? this.misCitas
      : this.misCitas.filter((c) => c.estado === this.filtro);
  }

  // Cuenta cuántas citas hay de un estado específico (para las tarjetas de resumen)
  contar(estado: EstadoCita): number {
    return this.misCitas.filter((c) => c.estado === estado).length;
  }

  cancelar(cita: Cita): void {
    this.citas.cancelar(cita.id);
  }
}