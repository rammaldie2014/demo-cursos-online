import { Specialist } from '../models';

/** Especialistas ficticios para la demo. No representan a personas reales. */
export const SPECIALISTS: readonly Specialist[] = [
  {
    id: 'carlos-mejia',
    name: 'Carlos Mejía',
    initials: 'CM',
    specialty: 'Marketing digital y crecimiento',
    description: 'Orientación para definir canales, contenidos y metas de crecimiento para tu negocio.',
    topics: ['Marketing digital', 'Estrategia de contenidos'],
    workingDays: [1, 2, 3, 4, 5],
    timeSlots: ['09:00', '10:00', '11:00', '15:00', '16:00'],
  },
  {
    id: 'lucia-torres',
    name: 'Lucía Torres',
    initials: 'LT',
    specialty: 'Finanzas para emprendedores',
    description: 'Revisión de costos, precios y flujo de caja para tomar mejores decisiones.',
    topics: ['Costos y precios', 'Flujo de caja'],
    workingDays: [1, 3, 5, 6],
    timeSlots: ['09:00', '11:00', '14:00', '16:00'],
  },
  {
    id: 'andres-rojas',
    name: 'Andrés Rojas',
    initials: 'AR',
    specialty: 'Ventas y modelo de negocio',
    description: 'Acompañamiento para estructurar tu proceso de ventas y validar tu modelo de negocio.',
    topics: ['Estrategia de ventas', 'Modelo de negocio'],
    workingDays: [2, 4, 6],
    timeSlots: ['10:00', '12:00', '15:00', '17:00'],
  },
];
