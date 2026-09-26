import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../../servicios/autenticacion.service';

// Esta pantalla sirve para dos casos (según cómo se llegó a ella, definido en app.routes.ts):
//  - "publico":  pacientes, con opción de iniciar sesión o registrarse.
//  - "personal": médico o administrador, solo pueden iniciar sesión (no registrarse).
@Component({
  selector: 'app-acceso',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './acceso.component.html',
})
export class AccesoComponent {
  esPersonal: boolean;
  vista: 'ingreso' | 'registro' = 'ingreso';

  // Campos del formulario
  correo = '';
  contrasena = '';
  nombre = '';
  documento = '';

  error = '';
  exito = '';

  constructor(ruta: ActivatedRoute, private auth: AutenticacionService, private router: Router) {
    // Revisamos por cuál ruta llegó el usuario para saber qué modo mostrar
    this.esPersonal = ruta.snapshot.data['modo'] === 'personal';
  }

  cambiarVista(nuevaVista: 'ingreso' | 'registro'): void {
    this.vista = nuevaVista;
    this.error = '';
    this.exito = '';
  }

  ingresar(): void {
    const error = this.auth.iniciarSesion(this.correo, this.contrasena, this.esPersonal);
    if (error) {
      this.error = error;
      return;
    }
    // Si el login fue exitoso, mandamos al usuario a su panel correspondiente
    const usuario = this.auth.usuarioActual()!;
    this.router.navigateByUrl(this.auth.rutaPorRol(usuario.rol));
  }

  registrar(): void {
    const error = this.auth.registrarPaciente(this.nombre, this.documento, this.correo, this.contrasena);
    if (error) {
      this.error = error;
      return;
    }
    // Si el registro fue exitoso, lo mandamos a la pestaña de login
    this.cambiarVista('ingreso');
    this.exito = 'Cuenta creada. Ya puedes iniciar sesión.';
    this.contrasena = '';
  }
}