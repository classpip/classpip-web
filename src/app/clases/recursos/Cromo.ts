export class Cromo {
  nombre: string;
  imagenDelante: string;
  imagenDetras: string;
  probabilidad: string;
  nivel: string;
  id: number;
  coleccionId: number;

  constructor(nombre: string, probabilidad?: string, nivel?: string, imagenDelante?: string, imagenDetras?: string) {

    this.nombre = nombre;
    this.probabilidad = probabilidad;
    this.nivel = nivel;
    this.imagenDelante = imagenDelante;
    this.imagenDetras = imagenDetras;
  }
}
