const OCULTA = "en_mazo";

/**
 * @class Clase pendiente de completar e implementar en próximas versiones
 */
export class Carta {
  constructor(valor, nombre, tipo, texto, efecto, imagen, numero) {
    this.valor = valor;
    this.nombre = nombre;
    this.tipo = tipo;
    this.texto = texto;
    this.efecto = efecto;
    this.imagen = imagen;
    this.numero = numero;
    //Estados posibles: descartada, visible, en_mazo
    this.estado = OCULTA;
  }
}
