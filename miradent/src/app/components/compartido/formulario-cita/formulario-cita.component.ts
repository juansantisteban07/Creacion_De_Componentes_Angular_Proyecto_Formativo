import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../../servicios/citas.service';
import { hoyISO } from '../../../utilidades/fechas';

// Formulario para agendar una cita. Se usa en dos lugares:
//  - Panel del paciente: [pacienteId] viene fijo (es él mismo).
//  - Panel del administrador: [elegirPaciente]="true" para que pueda
//    elegir a cuál paciente le está agendando la cita.
@Component({
  selector: 'app-formulario-cita',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario-cita.component.html',
})
export class FormularioCitaComponent {
  @Input() pacienteId: number | null = null;
  @Input() elegirPaciente = false;
  @Output() agendada = new EventEmitter<void>(); // Avisa cuando se agenda con éxito

  // Campos del formulario
  pacienteElegido: number | null = null;
  medicoId: number | null = null;
  fecha = '';
  hora = '';
  motivo = '';

  // Mensaje que se muestra al usuario (de éxito o de error)
  mensaje = '';
  esError = false;

  hoy = hoyISO(); // Para no dejar elegir fechas pasadas en el calendario

  constructor(public citas: CitasService) {}

  // Las horas disponibles dependen de qué médico y qué fecha se eligieron
  get horas(): string[] {
    return this.medicoId && this.fecha ? this.citas.horasLibres(this.fecha, this.medicoId) : [];
  }

  enviar(): void {
    const idPaciente = this.elegirPaciente ? this.pacienteElegido : this.pacienteId;

    // Revisamos que todos los campos estén completos
    if (!idPaciente || !this.medicoId || !this.fecha || !this.hora || !this.motivo.trim()) {
      this.mostrarMensaje('Completa todos los campos.', true);
      return;
    }

    const error = this.citas.agendar({
      pacienteId: idPaciente,
      medicoId: this.medicoId,
      fecha: this.fecha,
      hora: this.hora,
      motivo: this.motivo.trim(),
    });

    if (error) {
      this.mostrarMensaje(error, true);
      return;
    }

    // Todo salió bien: mostramos éxito y limpiamos el formulario
    this.mostrarMensaje('¡Cita agendada correctamente!', false);
    this.medicoId = null;
    this.fecha = '';
    this.hora = '';
    this.motivo = '';
    this.agendada.emit();
  }

  private mostrarMensaje(texto: string, esError: boolean): void {
    this.mensaje = texto;
    this.esError = esError;
  }
}