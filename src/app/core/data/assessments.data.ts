import { AssessmentDefinition } from '../models';
import { MAIN_COURSE_ID } from './courses.data';

export const ASSESSMENTS: readonly AssessmentDefinition[] = [
  {
    courseId: MAIN_COURSE_ID,
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        prompt: '¿Qué debes describir en el paso «Tu idea»?',
        options: [
          { id: 'a', text: 'El logotipo y los colores de la marca.' },
          { id: 'b', text: 'El producto o servicio y el problema que resuelve.' },
          { id: 'c', text: 'El precio final de venta.' },
        ],
        correctOptionId: 'b',
        feedback: 'La idea se centra en qué ofreces y qué problema atiendes.',
      },
      {
        id: 'q2',
        prompt: 'En el ejemplo de postres saludables, ¿qué información ayuda a definir al cliente ideal?',
        options: [
          { id: 'a', text: 'Solo su nombre.' },
          { id: 'b', text: 'La cantidad de seguidores de la competencia.' },
          { id: 'c', text: 'Sus hábitos, su necesidad principal y dónde encontrarlo.' },
        ],
        correctOptionId: 'c',
        feedback: 'El cliente ideal se describe por quién es, qué necesita y dónde está.',
      },
      {
        id: 'q3',
        prompt: '¿Qué es una propuesta de valor?',
        options: [
          { id: 'a', text: 'El beneficio principal para el cliente y lo que te diferencia.' },
          { id: 'b', text: 'Un descuento temporal.' },
          { id: 'c', text: 'El nombre legal de la empresa.' },
        ],
        correctOptionId: 'a',
        feedback: 'La propuesta de valor combina el beneficio para el cliente y tu diferenciador.',
      },
    ],
  },
];
