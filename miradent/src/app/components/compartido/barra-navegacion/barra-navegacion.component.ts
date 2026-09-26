import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../../servicios/autenticacion.service';

// La barra que aparece arriba en todas las páginas.
// Cambia lo que muestra dependiendo de si hay alguien con sesión iniciada o no.
@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './barra-navegacion.component.html',
})
export class BarraNavegacionComponent {
  constructor(public auth: AutenticacionService) {}
}