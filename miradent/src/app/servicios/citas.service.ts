import { Injectable } from '@angular/core';
import { Cita, RegistroClinico, Usuario } from '../modelos/modelos';
import { hoyISO } from '../utilidades/fechas';
import { BaseDatosService } from './base-datos.service';

// Horarios en los que la clínica atiende (con pausa de almuerzo entre 12 y 2pm)
const HORARIOS_DISPONIBLES = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

// Aquí está toda la lógica relacionada con citas e historias clínicas:
// crear, cancelar, marcar como atendida, consultar horarios libres, etc.
@Injectable({ providedIn: 'root' })
export class CitasService {
  constructor(private baseDatos: BaseDatosService) {}

  // Consultas (solo leen datos, no los cambian)

  medicos(): Usuario[] {
    return this.baseDatos.usuarios.filter((u) => u.rol === 'medico');
  }

  pacientes(): Usuario[] {
    return this.baseDatos.usuarios.filter((u) => u.rol === 'paciente');
  }

  // Busca el nombre de un usuario a partir de su id (útil para mostrar en tablas)
  nombreDe(id: number): string {
    return this.baseDatos.usuarios.find((u) => u.id === id)?.nombre ?? 'Desconocido';
  }

  todas(): Cita[] {
    return this.ordenarPorFecha(this.baseDatos.citas);
  }

  delPaciente(pacienteId: number): Cita[] {
    return this.ordenarPorFecha(this.baseDatos.citas.filter((c) => c.pacienteId === pacienteId));
  }

  delMedico(medicoId: number): Cita[] {
    return this.ordenarPorFecha(this.baseDatos.citas.filter((c) => c.medicoId === medicoId));
  }

  // Devuelve las horas libres de un médico en una fecha específica.
  // Descarta las horas ya ocupadas y, si la fecha es hoy, también las horas que ya pasaron.
  horasLibres(fecha: string, medicoId: number): string[] {
    const horasOcupadas = this.baseDatos.citas
      .filter((c) => c.medicoId === medicoId && c.fecha === fecha && c.estado !== 'cancelada')
      .map((c) => c.hora);

    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const esHoy = fecha === hoyISO();

    return HORARIOS_DISPONIBLES.filter(
      (hora) => !horasOcupadas.includes(hora) && (!esHoy || hora > horaActual)
    );
  }

  // Acciones (cambian datos)

  // Agenda una cita nueva. Devuelve un mensaje de error si algo falla,
  // o "null" si la cita se creó correctamente.
  agendar(datosCita: Omit<Cita, 'id' | 'estado'>): string | null {
    if (datosCita.fecha < hoyISO()) {
      return 'No puedes agendar en una fecha pasada.';
    }
    const horaSigueDisponible = this.horasLibres(datosCita.fecha, datosCita.medicoId).includes(datosCita.hora);
    if (!horaSigueDisponible) {
      return 'Ese horario ya no está disponible. Elige otro.';
    }

    this.baseDatos.citas.push({
      ...datosCita,
      id: this.baseDatos.siguienteId(this.baseDatos.citas),
      estado: 'programada',
    });
    this.baseDatos.guardar();
    return null;
  }

  cancelar(idCita: number): void {
    this.cambiarEstado(idCita, 'cancelada');
  }

  marcarAtendida(idCita: number): void {
    this.cambiarEstado(idCita, 'atendida');
  }

  // Historia clínica

  historiaDe(pacienteId: number): RegistroClinico[] {
    return this.baseDatos.historias
      .filter((h) => h.pacienteId === pacienteId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id); // Más reciente primero
  }

  agregarRegistro(pacienteId: number, autorId: number, descripcion: string): void {
    this.baseDatos.historias.push({
      id: this.baseDatos.siguienteId(this.baseDatos.historias),
      pacienteId,
      autorId,
      descripcion: descripcion.trim(),
      fecha: hoyISO(),
    });
    this.baseDatos.guardar();
  }

  private cambiarEstado(idCita: number, nuevoEstado: Cita['estado']): void {
    const cita = this.baseDatos.citas.find((c) => c.id === idCita);
    if (cita) {
      cita.estado = nuevoEstado;
      this.baseDatos.guardar();
    }
  }

  // Ordena una lista de citas de la más próxima a la más lejana en el tiempo
  private ordenarPorFecha(citas: Cita[]): Cita[] {
    return [...citas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  }
}