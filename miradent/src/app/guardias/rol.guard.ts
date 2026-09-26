import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../modelos/modelos';
import { AutenticacionService } from '../servicios/autenticacion.service';

// Esto es como un "guardia de seguridad" para las rutas.
// Antes de dejar entrar a alguien a una página, revisa si tiene sesión
// iniciada y si su rol es uno de los permitidos para esa página.
// Si no cumple, lo redirige de vuelta al login.
export const rolGuard = (rolesPermitidos: Rol[]): CanActivateFn => () => {
  const usuario = inject(AutenticacionService).usuarioActual();

  if (usuario && rolesPermitidos.includes(usuario.rol)) {
    return true; // Puede pasar
  }
  return inject(Router).parseUrl('/acceso'); // No puede, lo mandamos al login
};