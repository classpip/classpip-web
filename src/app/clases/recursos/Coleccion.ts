import { Cromo } from './Cromo';
export class Coleccion {
  nombre: string;
  imagenColeccion: string;
  dosCaras: boolean;
  id: number;
  profesorId: number;
  cromos: Cromo[];
  recomendacion: string;

  constructor(nombre: string, profesorId: number, imagenColeccion: string, dosCaras: boolean) {

    this.nombre = nombre;
    this.imagenColeccion = imagenColeccion;
    this.dosCaras = dosCaras;
    this.profesorId = profesorId;
  }
}
