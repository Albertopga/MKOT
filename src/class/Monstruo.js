import { log } from "../scripts/acciones.js";

const PUNTOS_VICTORIA = 20;
const PUNTOS_VIDA_INICIALES = 10;
const ELIMINADO = "eliminado";
const ACTIVO = "activo";

/**
 * @class Clase que define un monstruo/jugador y controla sus acciones
 */
export class Monstruo {
  constructor(nJugador) {
    this.nJUgador = nJugador;
    this.$eleTarjetaInfo = "";
    this.$eleZonaPuntos = "";
    this.vidaMaxima = PUNTOS_VIDA_INICIALES;
    this.vidaActual = this.vidaMaxima;
    this.puntosDeVictoria = 0;
    this.energia = 0;
    this.estado = "";
    this.$eleMiniatura = "";
    this.enTokyo = false;
  }

  /**
   * @description Método que aplica los puntos de vida recuperados, y muestra en pantalla el resumen.
   * @param cantidadGanada {int}
   * @see log
   */
  ganarVida(cantidadGanada) {
    // Si el monstruo está en Tokyo no puede recuperar vida
    if (this.enTokyo)
      return log(
        `<p class="resaltar">Dentro de Tokyo no puedes recuperar vida</p>`
      );

    // como no se pueden tener más puntos de vida que la vidaMáxima,
    // sumo los puntos ganado con la vida actual
    const res = this.vidaActual + cantidadGanada;
    // si el resultado es menor o igual a la vida máxima, aplico el resultado,
    // en caso de que sea mayor aplico la vida máxima que puede tener un monstruo
    this.vidaActual = res <= this.vidaMaxima ? res : this.vidaMaxima;
    if (res <= this.vidaMaxima)
      log(`<p>Recupera ${cantidadGanada} puntos de vida</p>`);
  }

  /**
   * @description Método que aplica los puntos de vida perdidos, y muestra en pantalla el resumen.
   * @param cantidadPerdida {int}
   * @see log
   */
  perderVida(cantidadPerdida) {
    const res = this.vidaActual - cantidadPerdida;
    this.vidaActual = res > 0 ? res : 0;
    log(
      `<p>El Jugador ${this.nJUgador} Pierde ${cantidadPerdida} puntos de vida</p>`
    );
  }

  /**
   * @description Método que aplica los puntos de victoria (estrellas) ganados, y muestra en pantalla el resumen.
   * @param cantidadPerdida {int}
   * @see log
   */
  ganarEstrellas(cantidadGanada) {
    this.puntosDeVictoria += cantidadGanada;
    log(`<p>Gana ${cantidadGanada} puntos de estrellas</p>`);
  }

  /**
   * @description Método que aplica los puntos de victoria (estrellas) perdidos, y muestra en pantalla el resumen.
   * @param cantidadPerdida {int}
   */
  perderEstrellas(cantidadPerdida) {
    const res = this.puntosDeVictoria - cantidadPerdida;
    this.puntosDeVictoria = res > 0 ? res : 0;
    log(`<p>Pierde ${cantidadPerdida} puntos de estrellas</p>`);
  }

  /**
   * @description Método que aplica los puntos de energía ganados, y muestra en pantalla el resumen.
   * @param cantidadPerdida {int}
   */
  ganarEnergia(cantidad) {
    this.energia += cantidad;
    log(`<p>Gana ${cantidad} puntos de energía</p>`);
  }

  /**
   * @description Método que aplica los puntos de energía perdidos, y muestra en pantalla el resumen.
   * @param cantidadPerdida {int}
   */
  perderEnergia(cantidad) {
    this.energia -= cantidad;
    log(
      `<p>El jugador ${this.nJUgador} pierde ${cantidad} puntos de energía</p>`
    );
  }

  /**
   * @description Método que controla si el monstruos tiene puntos de vida antes de actualizar la información mostrada
   * en pantalla. Si no tiene puntos de vida lo elimina del juego.
   * @see eliminar
   * @see mostrarPuntos
   */
  actualizarInfo() {
    if (this.vidaActual <= 0) this.eliminar();
    this.mostrarPuntos();
  }

  /**
   * @description Método que retorna true o false en función de si el monstruo ha llegado a los puntos de victoria.
   * @returns {boolean}
   */
  haGanado() {
    return this.puntosDeVictoria >= PUNTOS_VICTORIA;
  }

  /**
   * @description Método que modifica el contenido de elementos del DOM para mostrar por pantalla los puntos actuales
   * del monstruo.
   */
  mostrarPuntos() {
    let $elemP = $(this.$eleZonaPuntos).find("p");
    $($elemP[0]).html(this.puntosDeVictoria);
    $($elemP[1]).html(this.vidaActual);
    $($elemP[2]).html(this.energia);
  }

  /**
   * @description Método que modifica elementos del DOM para añadir la clase eliminado y cambia el estado del monstruo
   * a eliminado
   * @see mostrarPuntos
   */
  eliminar() {
    this.mostrarPuntos();
    $(this.$eleZonaPuntos).addClass(ELIMINADO);
    $(this.$eleMiniatura).addClass(ELIMINADO);
    this.estado = ELIMINADO;
  }

  /**
   * @description Método que modifica elementos del DOM para reinicia los valores mostrados en pantalla.
   * @see mostrarPuntos
   */
  resetear() {
    $(this.$eleZonaPuntos).removeClass(ELIMINADO);
    $(this.$eleTarjetaInfo).removeClass(ACTIVO);
    $(this.$eleMiniatura).removeClass(ACTIVO);
    $(this.$eleMiniatura).removeClass(ELIMINADO);
    this.estado = "";
    this.mostrarPuntos();
  }

  /**
   * @description Método que cambia el estado del atributo enTokyo a true y aplica los puntos de victoria por entrar en
   * Tokyo. Muestra en pantalla el resumen.
   * @see log
   * @see ganarEstrellas
   */
  entrarEnTokyo() {
    this.enTokyo = true;
    log(`<p>Jugador ${this.nJUgador} entra en Tokyo y por eso</p>`);
    this.ganarEstrellas(1);
  }

  /**
   * @description Método que cambia el estado del atributo enTokyo a false y muestra en pantalla el resumen.
   * @see log
   * @see ganarEstrellas
   */
  salirDeTokyo() {
    this.enTokyo = false;
    log(`<p>Jugador ${this.nJUgador} Abandona Tokyo</p>`);
  }
}
