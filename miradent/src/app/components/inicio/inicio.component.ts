import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BarraNavegacionComponent } from '../compartido/barra-navegacion/barra-navegacion.component';

/** Página principal, informativa. La ve cualquier visitante, sin necesidad de cuenta. */
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, BarraNavegacionComponent],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  // Cifras que le dan confianza al visitante (sección de estadísticas bajo el hero)
  estadisticas = [
    { numero: '12+', texto: 'Años de experiencia' },
    { numero: '8.500+', texto: 'Pacientes atendidos' },
    { numero: '6', texto: 'Especialistas' },
    { numero: '4.9★', texto: 'Calificación promedio' },
  ];

  // Servicios que ofrece la clínica, ahora con imagen de apoyo
  servicios = [
    {
      icono: '🪥',
      titulo: 'Limpieza y prevención',
      texto: 'Profilaxis, control de placa y educación en higiene oral.',
      imagen: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80&auto=format&fit=crop',
    },
    {
      icono: '😁',
      titulo: 'Ortodoncia',
      texto: 'Brackets y alineadores para una sonrisa alineada.',
      imagen: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80&auto=format&fit=crop',
    },
    {
      icono: '✨',
      titulo: 'Estética dental',
      texto: 'Blanqueamiento y diseño de sonrisa.',
      imagen: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop',
    },
    {
      icono: '🩺',
      titulo: 'Odontología general',
      texto: 'Calzas, endodoncias, extracciones y revisiones.',
      imagen: 'https://almaradental.es/wp-content/uploads/2019/07/ventajas-de-la-odontologia-general-1080x600-1.jpg',
    },
  ];

  // Fotos de las instalaciones para la sección "Conoce nuestra clínica"
  galeria = [
    { imagen: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=700&q=80&auto=format&fit=crop', texto: 'Consultorios equipados' },
    { imagen: 'https://i.pinimg.com/736x/83/af/7a/83af7a0fe7ffd7c901096e390e8b8180.jpg', texto: 'Sala de espera cómoda' },
    { imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqjcUhCQPUdK-88iZWNKy-xw_SklY4QA8hCHJ3XPCRdJpv_6WuNFgsE6M&s=10', texto: 'Tecnología de vanguardia' },
  ];

  // Perfiles breves del cuerpo médico
  equipo = [
    {
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK6yZpU1aAlRRFCwQfNncEKGykOaTgM77fVxIeskMbnWztt1zLzTimnBA&s=10',
      nombre: 'Dra. Laura Gómez',
      especialidad: 'Odontología general',
    },
    {
      imagen: 'https://s3-sa-east-1.amazonaws.com/doctoralia.co/doctor/71a1ed/71a1ed58a670e3285a8fe0f1b38055cd_large.jpg',
      nombre: 'Dr. Andrés Ruiz',
      especialidad: 'Ortodoncia',
    },
    {
      imagen: 'https://laclinicadental.com.co/wp-content/uploads/2022/11/Dra.-Bella-Suiza.png',
      nombre: 'Dra. Camila Torres',
      especialidad: 'Estética dental',
    },
  ];

  // Opiniones de pacientes (contenido de ejemplo para el prototipo)
  testimonios = [
    { nombre: 'Marcela P.', texto: 'Agendar la cita desde el celular fue muy fácil y me atendieron puntual.' },
    { nombre: 'Julián R.', texto: 'El sistema me avisa mis citas activas y puedo cancelar sin llamar. Excelente.' },
    { nombre: 'Daniela S.', texto: 'La atención del equipo es cálida y las instalaciones se ven impecables.' },
  ];

  // Preguntas frecuentes
  preguntas = [
    { pregunta: '¿Necesito crear una cuenta para agendar?', respuesta: 'Sí, el registro toma menos de un minuto y solo pide tus datos básicos.' },
    { pregunta: '¿Puedo cancelar una cita ya agendada?', respuesta: 'Claro, desde tu panel de usuario puedes cancelarla cuando lo necesites.' },
    { pregunta: '¿Atienden EPS o solo particular?', respuesta: 'Actualmente atendemos de forma particular; próximamente sumaremos convenios.' },
  ];

  private clicsSecretos = 0; // Cuenta cuántas veces se ha hecho clic en el pie de página

  constructor(private router: Router) {}

  // Truco para que el personal (médicos/admin) llegue a su login sin
  // que haya un botón visible al público: 5 clics seguidos en "© Miradent".
  accesoSecreto(): void {
    this.clicsSecretos++;
    if (this.clicsSecretos >= 5) {
      this.clicsSecretos = 0;
      this.router.navigateByUrl('/acceso-personal');
    }
  }
}