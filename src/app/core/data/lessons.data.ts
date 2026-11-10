import { Lesson } from '../models';
import { MAIN_COURSE_ID } from './courses.data';

export const LESSONS: readonly Lesson[] = [
  {
    id: 'tu-idea',
    courseId: MAIN_COURSE_ID,
    order: 1,
    moduleLabel: 'Paso 1',
    title: 'Tu idea',
    objective: 'Describir con claridad tu producto o servicio y el problema que resuelve.',
    explanation: [
      'Toda marca nace de una idea de negocio. Antes de pensar en nombres, colores o logotipos, necesitas poder explicar en pocas palabras qué ofreces y por qué alguien lo necesitaría.',
      'Una buena descripción responde a tres preguntas: ¿qué vendes?, ¿qué problema o deseo atiendes? y ¿cómo lo resuelves mejor que hoy?',
    ],
    keyPoints: [
      'Escribe como si se lo contaras a un cliente, sin tecnicismos.',
      'Enfócate en el problema real, no solo en el producto.',
      'Si no puedes explicarlo en dos frases, simplifícalo.',
    ],
    example: {
      title: 'Ejemplo: postres saludables',
      intro: 'Así describiría su idea una emprendedora que prepara postres en casa:',
      items: [
        { label: 'Producto', value: 'Postres caseros endulzados con fruta, sin azúcar refinada, en porciones individuales.' },
        {
          label: 'Problema',
          value: 'Personas que cuidan su alimentación no encuentran postres ricos y saludables cerca de su trabajo.',
        },
        { label: 'Cómo lo resuelve', value: 'Entrega en oficinas dos veces por semana con pedido previo por mensaje.' },
      ],
    },
    activity: {
      instructions: 'Describe tu propia idea. Los campos marcados con * son obligatorios para completar el paso.',
      fields: [
        {
          id: 'producto',
          label: '¿Qué producto o servicio ofreces?',
          kind: 'textarea',
          required: true,
          minLength: 15,
          maxLength: 400,
          placeholder: 'Ej.: Postres caseros endulzados con fruta…',
        },
        {
          id: 'problema',
          label: '¿Qué problema o necesidad resuelve?',
          kind: 'textarea',
          required: true,
          minLength: 15,
          maxLength: 400,
          placeholder: 'Ej.: No hay opciones saludables cerca de…',
        },
        {
          id: 'solucion',
          label: '¿Cómo lo resuelves?',
          kind: 'textarea',
          required: false,
          maxLength: 400,
          hint: 'Opcional: describe cómo llega tu solución al cliente.',
        },
      ],
    },
  },
  {
    id: 'tu-cliente-ideal',
    courseId: MAIN_COURSE_ID,
    order: 2,
    moduleLabel: 'Paso 2',
    title: 'Tu cliente ideal',
    objective: 'Identificar a quién te diriges y cuál es su necesidad principal.',
    explanation: [
      'Tu cliente ideal es la persona que más se beneficia de lo que ofreces y que está dispuesta a pagar por ello. Conocerlo te ayuda a decidir qué decir, dónde decirlo y cómo.',
      'Descríbelo como una persona concreta: su edad aproximada, a qué se dedica, qué le preocupa y dónde pasa su tiempo, tanto en línea como fuera de ella.',
    ],
    keyPoints: [
      'Un cliente ideal bien definido vale más que «todo el mundo».',
      'La necesidad es lo que lo mueve a comprar.',
      'Saber dónde está te dice por dónde comunicar.',
    ],
    example: {
      title: 'Ejemplo: cliente de postres saludables',
      intro: 'Para el negocio de postres saludables, el cliente ideal podría ser:',
      items: [
        { label: 'Público', value: 'Ana, 32 años, trabaja en una oficina en Lima y hace deporte tres veces por semana.' },
        { label: 'Necesidad', value: 'Darse un gusto por la tarde sin romper su plan de alimentación.' },
        { label: 'Dónde encontrarla', value: 'Grupos de bienestar en redes sociales, gimnasios y comedores de oficina.' },
      ],
    },
    activity: {
      instructions: 'Describe a tu cliente ideal. Puedes partir del ejemplo y editarlo con los datos de tu negocio.',
      fields: [
        {
          id: 'publico',
          label: '¿Quién es tu cliente ideal?',
          kind: 'textarea',
          required: true,
          minLength: 15,
          maxLength: 400,
          placeholder: 'Edad, ocupación, ubicación, hábitos…',
        },
        { id: 'necesidad', label: '¿Cuál es su necesidad principal?', kind: 'textarea', required: true, minLength: 10, maxLength: 400 },
        {
          id: 'canales',
          label: '¿Dónde lo encuentras?',
          kind: 'text',
          required: false,
          maxLength: 200,
          hint: 'Opcional: redes, lugares o comunidades.',
        },
      ],
    },
    sampleAnswers: {
      publico: 'Ana, 32 años, trabaja en una oficina en Lima y hace deporte tres veces por semana.',
      necesidad: 'Darse un gusto por la tarde sin romper su plan de alimentación.',
      canales: 'Grupos de bienestar en redes sociales, gimnasios y comedores de oficina.',
    },
  },
  {
    id: 'tu-propuesta-de-valor',
    courseId: MAIN_COURSE_ID,
    order: 3,
    moduleLabel: 'Paso 3',
    title: 'Tu propuesta de valor',
    objective: 'Explicar el beneficio principal de tu oferta y lo que te diferencia.',
    explanation: [
      'La propuesta de valor es la promesa que haces a tu cliente: el beneficio que obtiene al elegirte y la razón por la que eres distinto a otras opciones.',
      'Una fórmula útil es: «Ayudo a [cliente ideal] a [beneficio] mediante [diferenciador]». Después puedes ajustarla a un lenguaje más natural.',
    ],
    keyPoints: [
      'Habla del resultado para el cliente, no de tus características.',
      'El diferenciador debe ser real y fácil de comprobar.',
      'Una frase corta se recuerda mejor.',
    ],
    example: {
      title: 'Ejemplo: propuesta de postres saludables',
      intro: 'Aplicando la fórmula al negocio de postres:',
      items: [
        { label: 'Beneficio', value: 'Disfrutar un postre rico sin culpa y sin salir de la oficina.' },
        { label: 'Diferenciador', value: 'Recetas endulzadas solo con fruta y entrega programada en oficinas.' },
        {
          label: 'Frase de valor',
          value:
            'Ayudo a personas que cuidan su alimentación a darse un gusto saludable con postres endulzados con fruta que llegan a su oficina.',
        },
      ],
    },
    activity: {
      instructions: 'Construye tu propuesta de valor con la fórmula sugerida.',
      fields: [
        {
          id: 'beneficio',
          label: '¿Qué beneficio principal obtiene tu cliente?',
          kind: 'textarea',
          required: true,
          minLength: 10,
          maxLength: 300,
        },
        {
          id: 'diferenciador',
          label: '¿Qué te diferencia de otras opciones?',
          kind: 'textarea',
          required: true,
          minLength: 10,
          maxLength: 300,
        },
        {
          id: 'frase',
          label: 'Tu frase de valor',
          kind: 'textarea',
          required: true,
          minLength: 20,
          maxLength: 300,
          placeholder: 'Ayudo a … a … mediante …',
        },
      ],
    },
  },
  {
    id: 'tu-marca',
    courseId: MAIN_COURSE_ID,
    order: 4,
    moduleLabel: 'Paso 4',
    title: 'Tu marca',
    objective: 'Definir un nombre provisional y la personalidad de tu marca.',
    explanation: [
      'Con tu idea, tu cliente y tu propuesta claros, ya puedes darle identidad a tu negocio. Un nombre provisional te permite empezar a comunicar; podrás validarlo y registrarlo más adelante.',
      'La personalidad de marca describe cómo quieres que te perciban. Elige tres adjetivos y un tono de comunicación que conecten con tu cliente ideal.',
    ],
    keyPoints: [
      'Un buen nombre es fácil de pronunciar y recordar.',
      'Antes de usarlo comercialmente, verifica que el nombre esté disponible.',
      'La personalidad guía tus textos, colores e imágenes.',
    ],
    example: {
      title: 'Ejemplo: marca de postres saludables',
      intro: 'Una posible identidad para el negocio de postres:',
      items: [
        { label: 'Nombre provisional', value: 'Dulce Equilibrio' },
        { label: 'Personalidad', value: 'Cercana, fresca y confiable.' },
        { label: 'Tono', value: 'Cercano' },
      ],
    },
    activity: {
      instructions: 'Define la identidad inicial de tu marca.',
      fields: [
        { id: 'nombre', label: 'Nombre provisional de tu marca', kind: 'text', required: true, minLength: 2, maxLength: 40 },
        {
          id: 'personalidad',
          label: 'Personalidad: tres adjetivos',
          kind: 'text',
          required: true,
          minLength: 5,
          maxLength: 120,
          placeholder: 'Ej.: cercana, fresca y confiable',
        },
        {
          id: 'tono',
          label: 'Tono de comunicación',
          kind: 'select',
          required: true,
          options: ['Cercano', 'Profesional', 'Divertido', 'Inspirador'],
        },
        { id: 'mensaje', label: 'Mensaje o eslogan', kind: 'text', required: false, maxLength: 120, hint: 'Opcional.' },
      ],
    },
  },
];
