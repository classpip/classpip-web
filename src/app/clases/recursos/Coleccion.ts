export class Coleccion {
  nombre: string;
  imagenColeccion: string;
  dosCaras: boolean;
  id: number;
  profesorId: number;
  cromos: [];

  constructor(nombre: string, profesorId: number, imagenColeccion: string, dosCaras: boolean, cromos:[]) {

    this.nombre = nombre;
    this.imagenColeccion = imagenColeccion;
    this.dosCaras = dosCaras;
    this.profesorId = profesorId;
    this.cromos = cromos;
  }
}
