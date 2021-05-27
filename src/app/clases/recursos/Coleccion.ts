export class Coleccion {
  Nombre: string;
  ImagenColeccion: string;
  Publica: boolean;
  DosCaras: boolean;
  id: number;
  profesorId: number;
  cromos: [];

  constructor(nombre?: string, imagenColeccion?: string, dosCaras?: boolean, profesorId?: number, cromos?:[]) {

    this.Nombre = nombre;
    this.ImagenColeccion = imagenColeccion;
    this.DosCaras = dosCaras;
    this.profesorId = profesorId;
    this.Publica = false;
    this.cromos = cromos;
  }
}
