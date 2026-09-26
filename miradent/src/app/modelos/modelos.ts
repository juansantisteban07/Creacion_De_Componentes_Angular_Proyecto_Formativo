// Aquí definimos la "forma" que tienen los datos que maneja la app.
// No es código que haga algo, es más bien como un molde o plantilla.

// Los tres tipos de usuario que puede tener el sistema como tenemos en los requisitos
export type Rol = 'administrador' | 'medico' | 'paciente';

// En qué momento de su vida está una cita
export type EstadoCita = 'programada' | 'atendida' | 'cancelada';

// Se usa cuando el usuario filtra la lista de citas (incluye la opción "todas")
export type FiltroCita = 'todas' | EstadoCita;

// Un usuario del sistema (puede ser paciente, médico o administrador)
export interface Usuario {
  id: number;
  nombre: string;
  documento: string;
  correo: string;
  contrasena: string; 
  rol: Rol;
  especialidad?: string; // Este campo solo aplica si el usuario es médico
}

// Una cita médica
export interface Cita {
  id: number;
  pacienteId: number; // A qué paciente pertenece
  medicoId: number;   // Qué médico la atiende
  fecha: string;       // Formato AAAA-MM-DD, ejemplo: 2026-09-25
  hora: string;        // Formato HH:mm, ejemplo: 09:00
  motivo: string;       // Por qué el paciente pidió la cita
  estado: EstadoCita;
}

// Una anotación dentro de la historia clínica de un paciente
export interface RegistroClinico {
  id: number;
  pacienteId: number;
  fecha: string;
  autorId: number; // Quién escribió esta nota (normalmente el administrador)
  descripcion: string;
}