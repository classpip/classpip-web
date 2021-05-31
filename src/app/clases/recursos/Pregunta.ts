export class Pregunta {
    Titulo: string;
    Tipo: string; // "Cuatro opciones", "Verdadero o falso", "Respuesta abierta" o "Emparejamiento"
    Pregunta: string;
    Tematica: string;
    Imagen: string;
    FeedbackCorrecto: string;
    FeedbackIncorrecto: string;
    id: number;
    profesorId: number;

    RespuestaCorrecta: string; // "Cuatro opciones", "Respuesta abierta" y "Verdadero o falso"
    RespuestaIncorrecta1: string; // "Cuatro opciones"
    RespuestaIncorrecta2: string; // "Cuatro opciones"
    RespuestaIncorrecta3: string; // "Cuatro opciones"

    Emparejamientos: any[]; // ""Emparejamiento"


    // tslint:disable-next-line:one-line
    // tslint:disable-next-line:max-line-length
    constructor(titulo: string, tipo: string, pregunta: string, tematica: string,  feedbackCorrecto: string, feedbackIncorrecto: string, profesorId: number, imagen?: string, emparejamientos?: Array<any>, correcta?: string,
      incorrecta1?: string, incorrecta2?: string, incorrecta3?: string) {
      // Estos son los campos que tienen todos los tipos de pregunta
      // El resto de atributos hay que ponerselos aparte, cuando se sepa de qué tipo es,
        this.Titulo = titulo;
        this.Tipo = tipo,
        this.Pregunta = pregunta;
        this.Tematica = tematica;
        this.Imagen = imagen;
        this.FeedbackCorrecto = feedbackCorrecto;
        this.FeedbackIncorrecto = feedbackIncorrecto;
        this.Emparejamientos = emparejamientos;
        this.profesorId = profesorId;
        this.RespuestaCorrecta = correcta;
        this.RespuestaIncorrecta1 = incorrecta1;
        this.RespuestaIncorrecta2 = incorrecta2;
        this.RespuestaIncorrecta3 = incorrecta3;
    }
}
