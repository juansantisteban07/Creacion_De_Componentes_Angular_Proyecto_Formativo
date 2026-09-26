// Convierte una fecha de JavaScript a texto "AAAA-MM-DD" usando la hora
export function aISO(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

// Atajo para obtener la fecha de hoy ya en formato texto
export const hoyISO = (): string => aISO(new Date());