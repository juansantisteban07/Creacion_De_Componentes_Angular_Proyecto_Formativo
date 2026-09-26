import { Injectable } from '@angular/core';
import { Cita, RegistroClinico, Usuario } from '../modelos/modelos';
import { aISO } from '../utilidades/fechas';

// Este servicio hace el papel de "base de datos" del prototipo.
// Como no tenemos un servidor todavía, guardamos todo en el navegador
// (localStorage), que recuerda los datos aunque cierres la pestaña.
@Injectable({ providedIn: 'root' })
export class BaseDatosService {
  private readonly CLAVE = 'miradent_db'; // Nombre bajo el cual se guarda todo

  usuarios: Usuario[] = [];
  citas: Cita[] = [];
  historias: RegistroClinico[] = [];

  constructor() {
    // Al arrancar, intentamos cargar lo que ya estaba guardado.
    const guardado = localStorage.getItem(this.CLAVE);
    if (guardado) {
      const datos = JSON.parse(guardado);
      this.usuarios = datos.usuarios;
      this.citas = datos.citas;
      this.historias = datos.historias;
    } else {
      // Si es la primera vez que se abre la app, creamos datos de ejemplo.
      this.cargarDatosIniciales();
      this.guardar();
    }
  }

  // Guarda el estado actual de todo en el navegador.
  // Se llama cada vez que algo cambia (se crea una cita, se cancela, etc.)
  guardar(): void {
    localStorage.setItem(
      this.CLAVE,
      JSON.stringify({ usuarios: this.usuarios, citas: this.citas, historias: this.historias })
    );
  }

  // Calcula un id nuevo que no se repita, buscando el más alto y sumando 1.
  siguienteId(lista: { id: number }[]): number {
    return lista.length ? Math.max(...lista.map((elemento) => elemento.id)) + 1 : 1;
  }

  // Datos de prueba para que puedas usar la app desde el primer momento
  // sin tener que crear todo manualmente.
  private cargarDatosIniciales(): void {
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    this.usuarios = [
      { id: 1, nombre: 'Administrador Miradent', documento: '1000000001', correo: 'admin@miradent.com', contrasena: 'admin123', rol: 'administrador' },
      { id: 2, nombre: 'Dra. Laura Gómez', documento: '1000000002', correo: 'medico@miradent.com', contrasena: 'medico123', rol: 'medico', especialidad: 'Odontología general' },
      { id: 3, nombre: 'Dr. Andrés Ruiz', documento: '1000000003', correo: 'ortodoncia@miradent.com', contrasena: 'medico123', rol: 'medico', especialidad: 'Ortodoncia' },
      { id: 4, nombre: 'Paciente Demo', documento: '1000000004', correo: 'paciente@miradent.com', contrasena: 'paciente123', rol: 'paciente' },
    ];

    this.citas = [
      { id: 1, pacienteId: 4, medicoId: 2, fecha: aISO(hoy), hora: '09:00', motivo: 'Limpieza dental', estado: 'programada' },
      { id: 2, pacienteId: 4, medicoId: 3, fecha: aISO(manana), hora: '10:00', motivo: 'Control de ortodoncia', estado: 'programada' },
    ];

    this.historias = [
      { id: 1, pacienteId: 4, fecha: aISO(hoy), autorId: 1, descripcion: 'Primera consulta de valoración.' },
    ];
  }
}