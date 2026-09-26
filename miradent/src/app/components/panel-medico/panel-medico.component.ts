import { Component } from '@angular/core';
import { Cita } from '../../modelos/modelos';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { CitasService } from '../../servicios/citas.service';
import { hoyISO } from '../../utilidades/fechas';
import { BarraNavegacionComponent } from '../compartido/barra-navegacion/barra-navegacion.component';
import { CalendarioComponent } from '../compartido/calendario/calendario.component';
import { ListaCitasComponent } from '../compartido/lista-citas/lista-citas.component';

// Panel del médico: ve sus citas de hoy, las próximas, y puede marcar
// cuáles ya atendió. No puede cancelar citas (eso solo lo hace el paciente o el admin).
@Component({
  selector: 'app-panel-medico',
  standalone: true,
  imports: [BarraNavegacionComponent, CalendarioComponent, ListaCitasComponent],
  templateUrl: './panel-medico.component.html',
})
export class PanelMedicoComponent {
  diaSeleccionado = hoyISO();

  constructor(private auth: AutenticacionService, private citas: CitasService) {}

  get usuario() {
    return this.auth.usuarioActual()!;
  }

  get misCitas(): Cita[] {
    return this.citas.delMedico(this.usuario.id);
  }

  get citasHoy(): Cita[] {
    return this.misCitas.filter((c) => c.fecha === hoyISO());
  }

  get pendientesHoy(): number {
    return this.citasHoy.filter((c) => c.estado === 'programada').length;
  }

  get proximas(): Cita[] {
    return this.misCitas.filter((c) => c.fecha > hoyISO() && c.estado === 'programada');
  }

  get citasDelDia(): Cita[] {
    return this.misCitas.filter((c) => c.fecha === this.diaSeleccionado);
  }

  atender(cita: Cita): void {
    this.citas.marcarAtendida(cita.id);
  }
}