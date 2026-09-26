import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cita } from '../../../modelos/modelos';
import { CitasService } from '../../../servicios/citas.service';

// Una tabla de citas que se puede reutilizar en cualquier panel.
// Este componente NO decide qué hacer cuando se cancela o atiende una cita;
// solo avisa con un evento, y el panel que lo usa (padre) decide qué hacer.
@Component({
  selector: 'app-lista-citas',
  standalone: true,
  templateUrl: './lista-citas.component.html',
})
export class ListaCitasComponent {
  @Input() lista: Cita[] = [];
  @Input() mostrarPaciente = false; // Muestra la columna con el nombre del paciente
  @Input() mostrarMedico = false;   // Muestra la columna con el nombre del médico
  @Input() puedeCancelar = false;   // Muestra el botón de cancelar
  @Input() puedeAtender = false;    // Muestra el botón de "marcar como atendida"

  @Output() cancelar = new EventEmitter<Cita>();
  @Output() atender = new EventEmitter<Cita>();

  constructor(public citas: CitasService) {}

  // Antes de avisar que se quiere cancelar, pedimos confirmación
  pedirCancelar(cita: Cita): void {
    if (confirm('¿Seguro que deseas cancelar esta cita?')) {
      this.cancelar.emit(cita);
    }
  }
}