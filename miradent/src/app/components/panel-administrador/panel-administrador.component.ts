import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cita, FiltroCita } from '../../modelos/modelos';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { CitasService } from '../../servicios/citas.service';
import { hoyISO } from '../../utilidades/fechas';
import { BarraNavegacionComponent } from '../compartido/barra-navegacion/barra-navegacion.component';
import { CalendarioComponent } from '../compartido/calendario/calendario.component';
import { FormularioCitaComponent } from '../compartido/formulario-cita/formulario-cita.component';
import { ListaCitasComponent } from '../compartido/lista-citas/lista-citas.component';

// Panel del administrador. Tiene 3 pestañas:
//  1. Calendario con todas las citas de la clínica.
//  2. Gestión de citas: agendar para cualquier paciente y cancelar.
//  3. Historia clínica: agregar notas a la ficha de cada paciente.
@Component({
  selector: 'app-panel-administrador',
  standalone: true,
  imports: [FormsModule, BarraNavegacionComponent, CalendarioComponent, FormularioCitaComponent, ListaCitasComponent],
  templateUrl: './panel-administrador.component.html',
})
export class PanelAdministradorComponent {
  pestana: 'calendario' | 'citas' | 'historia' = 'calendario';

  // --- Pestaña "Calendario" ---
  diaSeleccionado = hoyISO();

  // --- Pestaña "Citas" ---
  filtro: FiltroCita = 'todas';
  filtros: FiltroCita[] = ['todas', 'programada', 'atendida', 'cancelada'];

  // --- Pestaña "Historia clínica" ---
  pacienteHistoriaId: number | null = null;
  nuevaNota = '';

  constructor(private auth: AutenticacionService, public citas: CitasService) {}

  get todas(): Cita[] {
    return this.citas.todas();
  }

  get citasDelDia(): Cita[] {
    return this.todas.filter((c) => c.fecha === this.diaSeleccionado);
  }

  get citasFiltradas(): Cita[] {
    return this.filtro === 'todas' ? this.todas : this.todas.filter((c) => c.estado === this.filtro);
  }

  get historia() {
    return this.pacienteHistoriaId ? this.citas.historiaDe(this.pacienteHistoriaId) : [];
  }

  cancelar(cita: Cita): void {
    this.citas.cancelar(cita.id);
  }

  // Guarda una nueva anotación en la historia clínica del paciente seleccionado
  guardarNota(): void {
    if (!this.pacienteHistoriaId || !this.nuevaNota.trim()) return;
    this.citas.agregarRegistro(this.pacienteHistoriaId, this.auth.usuarioActual()!.id, this.nuevaNota);
    this.nuevaNota = '';
  }
}