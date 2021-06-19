export class Pregunta {
    titulo: string;
    tipo: string; // "Cuatro opciones", "Verdadero o falso", "Respuesta abierta" o "Emparejamiento"
    pregunta: string;
    tematica: string;
    imagen: string;
    feedbackCorrecto: string;
    feedbackIncorrecto: string;
    id: number;
    profesorId: number;

    respuestaCorrecta: string; // "Cuatro opciones", "Respuesta abierta" y "Verdadero o falso"
    respuestaIncorrecta1: string; // "Cuatro opciones"
    respuestaIncorrecta2: string; // "Cuatro opciones"
    respuestaIncorrecta3: string; // "Cuatro opciones"

    emparejamientos: any[]; // ""Emparejamiento"


    // tslint:disable-next-line:one-line
    // tslint:disable-next-line:max-line-length
    constructor(titulo: string, tipo: string, pregunta: string, tematica: string,  feedbackCorrecto: string, feedbackIncorrecto: string, profesorId: number, imagen?: string, emparejamientos?: Array<any>, correcta?: string,
      incorrecta1?: string, incorrecta2?: string, incorrecta3?: string) {
      // Estos son los campos que tienen todos los tipos de pregunta
      // El resto de atributos hay que ponerselos aparte, cuando se sepa de qué tipo es,
        this.titulo = titulo;
        this.tipo = tipo,
        this.pregunta = pregunta;
        this.tematica = tematica;
        this.imagen = imagen;
        this.feedbackCorrecto = feedbackCorrecto;
        this.feedbackIncorrecto = feedbackIncorrecto;
        this.emparejamientos = emparejamientos;
        this.profesorId = profesorId;
        this.respuestaCorrecta = correcta;
        this.respuestaIncorrecta1 = incorrecta1;
        this.respuestaIncorrecta2 = incorrecta2;
        this.respuestaIncorrecta3 = incorrecta3;
    }
}
