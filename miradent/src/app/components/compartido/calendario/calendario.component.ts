import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Cita } from '../../../modelos/modelos';
import { aISO, hoyISO } from '../../../utilidades/fechas';

// Representa una casilla (un día) dentro del calendario
interface Celda {
  dia: number;
  fecha: string;
  cantidad: number; // Cuántas citas activas hay ese día
}

// Un calendario de mes que se puede reutilizar en varios paneles.
// Recibe las citas desde afuera y avisa (con un evento) cuando el usuario
// hace clic en un día, para que el panel que lo usa haga lo que necesite.
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './calendario.component.html',
})
export class CalendarioComponent {
  @Input() citas: Cita[] = [];
  @Output() diaSeleccionado = new EventEmitter<string>();

  nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  hoy = hoyISO();
  seleccionado = hoyISO();
  private mesActual = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Texto tipo "septiembre 2026" para mostrar en la cabecera
  get titulo(): string {
    return this.mesActual.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  }

  // Genera todas las casillas del mes que se está mostrando.
  // Las casillas "null" son los espacios vacíos antes del día 1
  // (para que la semana empiece en lunes).
  get celdas(): (Celda | null)[] {
    const anio = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();

    const espaciosVacios = (new Date(anio, mes, 1).getDay() + 6) % 7;
    const totalDiasDelMes = new Date(anio, mes + 1, 0).getDate();

    const celdas: (Celda | null)[] = Array(espaciosVacios).fill(null);

    for (let dia = 1; dia <= totalDiasDelMes; dia++) {
      const fecha = aISO(new Date(anio, mes, dia));
      const cantidad = this.citas.filter((c) => c.fecha === fecha && c.estado !== 'cancelada').length;
      celdas.push({ dia, fecha, cantidad });
    }
    return celdas;
  }

  // Cambia de mes: -1 para retroceder, 1 para avanzar
  cambiarMes(direccion: number): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + direccion, 1);
  }

  // Cuando el usuario hace clic en un día
  elegir(fecha: string): void {
    this.seleccionado = fecha;
    this.diaSeleccionado.emit(fecha);
  }
}