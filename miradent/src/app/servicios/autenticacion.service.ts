import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Rol, Usuario } from '../modelos/modelos';
import { BaseDatosService } from './base-datos.service';

// Este servicio se encarga de todo lo relacionado con "quién está usando la app":
// iniciar sesión, registrarse y cerrar sesión.
@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly CLAVE_SESION = 'miradent_sesion';

  // "usuarioActual" guarda quién tiene la sesión abierta en este momento.
  // Es un "signal": cualquier parte de la app que lo use se actualiza sola
  // cuando este valor cambia, sin que tengamos que hacer nada extra.
  usuarioActual = signal<Usuario | null>(this.leerSesion());

  constructor(private baseDatos: BaseDatosService, private router: Router) {}

  // Intenta iniciar sesión. Si algo sale mal devuelve un mensaje de error,
  // y si todo está bien devuelve "null" (nada de qué quejarse).
  // "esPersonal" indica si viene de la pantalla oculta (médico/admin) o de la pública (paciente).
  iniciarSesion(correo: string, contrasena: string, esPersonal: boolean): string | null {
    const mensajeError = 'Correo o contraseña incorrectos.';

    const usuario = this.baseDatos.usuarios.find(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.contrasena === contrasena
    );
    if (!usuario) return mensajeError;

    // Un paciente no puede entrar por la puerta del personal, y viceversa.
    // Usamos el mismo mensaje de error para no dar pistas de por qué falló.
    const esUsuarioPersonal = usuario.rol !== 'paciente';
    if (esUsuarioPersonal !== esPersonal) return mensajeError;

    this.usuarioActual.set(usuario);
    sessionStorage.setItem(this.CLAVE_SESION, String(usuario.id));
    return null;
  }

  // Registro público: siempre crea un paciente (nunca médico ni admin).
  registrarPaciente(nombre: string, documento: string, correo: string, contrasena: string): string | null {
    if (!nombre.trim() || !documento.trim() || !correo.trim() || contrasena.length < 6) {
      return 'Completa todos los campos (la contraseña debe tener mínimo 6 caracteres).';
    }

    const correoYaExiste = this.baseDatos.usuarios.some(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase()
    );
    if (correoYaExiste) return 'Ya existe una cuenta con ese correo.';

    this.baseDatos.usuarios.push({
      id: this.baseDatos.siguienteId(this.baseDatos.usuarios),
      nombre: nombre.trim(),
      documento: documento.trim(),
      correo: correo.trim(),
      contrasena,
      rol: 'paciente',
    });
    this.baseDatos.guardar();
    return null;
  }

  // Dice a qué panel debe ir cada rol después de iniciar sesión.
  rutaPorRol(rol: Rol): string {
    return `/${rol}`;
  }

  // Cierra la sesión y devuelve al usuario a la página de inicio.
  cerrarSesion(): void {
    this.usuarioActual.set(null);
    sessionStorage.removeItem(this.CLAVE_SESION);
    this.router.navigateByUrl('/');
  }

  // Si el usuario recarga la página, esto recupera su sesión
  // para que no tenga que volver a iniciar sesión.
  private leerSesion(): Usuario | null {
    const idGuardado = sessionStorage.getItem(this.CLAVE_SESION);
    if (!idGuardado) return null;

    const datos = JSON.parse(localStorage.getItem('miradent_db') ?? '{"usuarios":[]}');
    return datos.usuarios.find((u: Usuario) => u.id === Number(idGuardado)) ?? null;
  }
}