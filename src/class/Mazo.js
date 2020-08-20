import { Carta } from "./Carta.js";

/**
 * @class Clase que se utilizará en proximas versiones del juego
 * El mazos estará compuesto por tantas instancias de Carta cómo filas tenga la tabla cartas
 * de la base de datos db_mkot.
 * @todo Pendiente de implementar
 */

export class Mazo {
  constructor() {
    this.cartas = null;
  }

  llenarMazo(cartasTexto) {
    let cartas = [];
    for (let carta of cartasTexto.split("*")) {
      if (carta[0] != undefined) {
        carta = carta.split(",");
        let objCarta = new Carta(
          carta[0], // valor
          carta[1], // nombre
          carta[2], // tipo
          carta[3], // texto
          carta[4], // efecto
          carta[5], // URL imagen
          carta[6] //número
        );
        cartas.push(objCarta);
      }
    }
    this.cartas = cartas;
    return cartas;
  }

  barajarMazo() {
    let longitud = this.cartas.length - 1;
    let temp;
    let index;
    // Hacer tantas veces como cartas hay en mazoCartas
    while (longitud > 0) {
      // indice aleatorio
      index = Math.floor(Math.random() * longitud);
      longitud--;
      // intercambia el ultimo elemento por este
      temp = this.cartas[longitud];
      this.cartas[longitud] = this.cartas[index];
      this.cartas[index] = temp;
    }
  }

  // Método que saca una carta del mazo y retorna esa carta.
  sacarCarta() {
    let resultado;
    // genero indice aleatorio
    let index = Math.floor(Math.random() * this.cartas.length);
    this.cartas[index].estado = "visible";
    resultado = this.cartas[index];
    this.cartas.splice(index, 1);

    // retorno la carta de ese indice
    return resultado;
  }

  // añade al mazo la carta indicada, normalmente será al mazo de descartes
  addCartaDescartada(carta) {
    if (carta.estado === "visible") {
      carta.estado = "descartada";
      this.push(carta);
    }
  }

  estaVacio() {
    let resultado;
    this.cartas.length === 0 ? (resultado = true) : (resultado = false);
    return resultado;
  }
}
