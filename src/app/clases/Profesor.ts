export class Profesor {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  imagenPerfil: string;
  identificador: string; // lo usan los alumnos para asociarse a este profesor al registrarse
  id: number;
  userId: number;

  constructor(  Nombre?: string, PrimerApellido?: string, SegundoApellido?: string,
                ImagenPerfil?: string, Identificador?: string, id?: number, userId?: number) {

    this.nombre = Nombre;
    this.primerApellido = PrimerApellido;
    this.segundoApellido = SegundoApellido;
    this.imagenPerfil = ImagenPerfil;
    this.identificador = Identificador;
    this.id = id;
    this.userId = userId;
  }
}
