import { Dado } from "./Dado.js";
import { Mazo } from "./Mazo.js";
import {
  pintarTablero,
  log,
  moverATokyo,
  resaltarElemento,
  prepararMonstruos,
  centrarScroll,
} from "../scripts/acciones.js";

const SELECCIONADO = "seleccionado";
const ELIMINADO = "eliminado";
const ACTIVO = "activo";
const OCULTO = "oculto";

/**
 * @class Clase que controla la lógica del juego.
 */
export class Juego {
  /** @constructor
   * @todo Mejorar el encapsulamiento, haciendo que el constructor reciba los elementos del DOM que va a utilizar,
   * en lugar de capturarlos el
   */
  constructor() {
    this.jugadores = [];
    this.dados = [
      new Dado($("#d1")),
      new Dado($("#d2")),
      new Dado($("#d3")),
      new Dado($("#d4")),
      new Dado($("#d5")),
      new Dado($("#d6")),
    ];
    this.jugadorActivo = undefined;
    this.indiceJugadorActivo = undefined;
    this.ganador = undefined;
    this.contTiradas = 0;
    this.$eleNext = document.getElementById("cambio");
    this.$eleDice = document.getElementById("tirar");
    this.$eleWin = document.getElementById("win");
    this.monstruoEnTokyo = undefined;
    this.mazoCartas = new Mazo();
  }

  /**
   * @description Método encargado de inicializar el juego
   * @see pintarTablero
   * @see moverATokyo
   * @see jugadorInicial
   */
  iniciarJuego() {
    pintarTablero();
    this.jugadores = prepararMonstruos();
    this.jugadorInicial();
    /*Pendiente de implementar en siguientes versiones
    this.cartasIniciales(this.mazoCartas)*/
  }

  /**
   * @description Establece cual es es el jugador inicial, lo resalta y hace su primera tirada de dados.
   * @see prepararMonstruos
   * @see resaltarElemento
   * @see actualizarPuntos
   * @see tirarDados
   */
  jugadorInicial() {
    this.jugadorActivo = this.jugadores[0];
    resaltarElemento(this.jugadorActivo.$eleTarjetaInfo);
    this.indiceJugadorActivo = 0;
    this.actualizarPuntos();
    log(`<h1>Turno de Jugador ${this.jugadorActivo.nJUgador}</h1>`);
    centrarScroll();
    this.tirarDados();
  }

  /**
   * @todo Pendiente de implementar en el juego.
   * @description Se encargará de sacar tres cartas del mazo de juego
   * @see sacarCarta
   */
  cartasIniciales() {
    this.mazoCartas.barajarMazo();
    if (this.mazoCartas.cartas.length > 0) {
      this.cartaMostrada1 = this.mazoCartas.sacarCarta();
      this.cartaMostrada2 = this.mazoCartas.sacarCarta();
      this.cartaMostrada3 = this.mazoCartas.sacarCarta();
    }
  }

  /**
   * @description Realiza la tirada de los dados no seleccionados, en el caso de que el número de tiradas realizadas
   * por el jugador actual, no supere las tres tiradas.
   * @see log
   * @see efectoDeSonido
   * @see lanzarDado
   * @see estaSeleccionado
   */
  tirarDados() {
    this.contTiradas++;
    // Si el contador de tiradas es igual a tres o más, muestra un mensaje por la pantalla resumen de turno y sale
    if (this.contTiradas < 4) {
      this.efectoDeSonido(this.$eleDice.play());
      //Lanza los dados que no están seleccionados
      this.dados.forEach((dado) => {
        if (!dado.estaSeleccionado()) dado.lanzarDado();
      });
    }

    if (this.contTiradas === 4) {
      log(
        `<p class="resaltar">Solo se puede hacer tres tiradas. Click en "Finalizar"</p>`
      );
      centrarScroll();
    }
  }

  /**
   * @description Método que selecciona un dado, siempre y cuando se haya realizado ya una tirada.
   * @param $elDado {$ElementType}
   * @param tag {string}
   * @see log
   */
  seleccionarDado($elDado, tag) {
    if (tag === "IMG") {
      if ($elDado.hasClass(SELECCIONADO)) {
        $elDado.removeClass(SELECCIONADO);
      } else {
        $elDado.addClass(SELECCIONADO);
      }
    }
  }

  /**
   * @description Método que se encarga de interpretar los resultados de la tirada de dados y aplicar sus resultados.
   * @see log
   * @see aplicarResultados
   * @see actualizarPuntos
   * @see haSobrevivido
   * @see haGanado
   * @see cambiarJugadorActivo
   * @see reiniciarTiradas
   * @see tirarDados
   */
  resolverTirada() {
    let resultadoTirada = [];
    // almaceno el resultado de todos los dados
    this.dados.forEach((dado) => resultadoTirada.push(dado.resultado));
    this.aplicarResultados(resultadoTirada);
    this.actualizarPuntos();
    // controlo si el jugador actual he ganado por ser el úncio con vida
    if (this.haSobrevivido() || this.jugadorActivo.haGanado())
      return this.haGanado(this.jugadorActivo);
    this.cambiarJugadorActivo();
    this.reiniciarTiradas();
    this.tirarDados();
  }

  /**
   * @description Método encargado de tomar los resultados de las tiradas de dados y aplicarlos.
   * @param resultadoTirada {int[]}
   * @see calcularEstrellas
   * @see ganarVida
   * @see ganarEnergia
   * @see calcularHeridas
   */
  aplicarResultados(resultadoTirada) {
    // filtro los resultados para almacenar los que que coincidan. sólo lo hago con 4, 5 y 6 puesto que estos
    // resultados no ecesitán reglas especiales para aplicar sus resultados.
    let garras = resultadoTirada.filter((element) => element === 4);
    let energia = resultadoTirada.filter((element) => element === 5);
    let vida = resultadoTirada.filter((element) => element === 6);
    // en el caso de 1, 2 y 3, se necesita calcular los puntos a aplicar
    this.calcularEstrellas(resultadoTirada);
    // controlo que los array contengan elementos para no llamar innecesariamente a ningún método
    if (vida.length > 0) this.ganarVida(vida.length);
    if (energia.length > 0) this.ganarEnergia(energia.length);
    if (garras.length > 0) this.calcularHeridas(garras.length);
  }

  /**
   * @description Método que calcula las estrellas (punts de victoria) correspondientes en base al resultado de los dados.
   * @param resultadoTirada {int[]}
   * @see ganarEstrellas
   */
  calcularEstrellas(resultadoTirada) {
    let cantidad = 0;
    for (let i = 1; i <= 3; i++) {
      // i será igual al valor del dado 1, 2 o 3
      let numIguales = resultadoTirada.filter((element) => element === i)
        .length; // almaceno los numero iguales
      if (numIguales >= 3) {
        // si  como mínimo hay tres valores del dado iguales
        cantidad = i; // se ganarán tantas estrellas como el valor de i ( el valor del dado )
        if (numIguales - 3 > 0) {
          // por cada valor repetido por encima de tres se ganarán tantos puntos como valores repetidos,
          // menos los tres que ya se han usado para puntuar antes
          cantidad = cantidad + (numIguales - 3);
        }
      }
      if (cantidad > 0) this.ganarEstrellas(cantidad); // añado las estrellas al jugador actual
      cantidad = 0; /** reinicio el contador para repetir el proceso con el siguiente valor (i) */
    }
  }

  /**
   * @description Método encargado de quitar al jugador activo y poner al siguiente como el activo
   * @see resaltarElemento
   * @see efectoDeSonido
   * @see log
   * @see sigueEnTokyo
   */
  cambiarJugadorActivo() {
    //quito el marco del jugador activo */
    resaltarElemento(this.jugadorActivo.$eleTarjetaInfo);

    // almaceno el indice del jugador activo y le quito el estado de activo
    this.indiceJugadorActivo = this.jugadores.indexOf(this.jugadorActivo);
    this.jugadorActivo.estado = "";

    // controlo que el jugador actual no sea el ultimo del array
    if (this.indiceJugadorActivo < this.jugadores.length - 1) {
      // si no lo es, cambio el jugador activo por el siguiente del array
      this.jugadorActivo = this.jugadores[this.indiceJugadorActivo + 1];
      this.indiceJugadorActivo++;
    } else {
      // si es el ultimo tomo como jugador activo al de la primera posición del array
      this.jugadorActivo = this.jugadores[0];
      this.indiceJugadorActivo = 0;
    }
    //sonidito para indicar el cambio de jugador
    this.efectoDeSonido(this.$eleNext.play());

    // pongo el estado como activo y remarco su avatar para indicar que es el jugador actual.
    resaltarElemento(this.jugadorActivo.$eleTarjetaInfo);
    this.jugadorActivo.estado = ACTIVO;

    // escribo el número del siguiente jugador en la zona de resumen de turno
    log(`<h1>Turno de Jugador ${this.jugadorActivo.nJUgador}</h1>`);
    centrarScroll();
    // miro si el jugador comienza en tokyo para ganar su puntos correspondientes
    this.sigueEnTokyo();
  }

  /**
   * @description Método que controla si el jugador/monstruo activo está en Tokyo al comienzo de su turno, en caso
   * afirmativo le suma dos puntos de victoria (estrellas) y actualiza su marcador de puntos.
   * @see ganarEstrellas
   * @see actualizarInfo
   * @see log
   */
  sigueEnTokyo() {
    if (this.jugadorActivo === this.monstruoEnTokyo) {
      log("<p>Por mantenerse en Tokyo un turno:</p>");
      centrarScroll();
      this.jugadorActivo.ganarEstrellas(2);
      this.jugadorActivo.actualizarInfo();
    }
  }

  /**
   * @description Método que des selecciona todos los dados del juego.
   * @see deseleccionar
   */
  reiniciarTiradas() {
    this.dados.forEach((dado) => dado.desSeleccionar());
    this.contTiradas = 0;
  }

  /**
   * @description Método que actualiza la información de todos los jugadores/monstruos
   * @see actualizarInfo
   */
  actualizarPuntos() {
    for (const monstruo of this.jugadores) {
      monstruo.actualizarInfo();
    }
  }

  /**
   * @description Método que controla si el jugador/monstruo activo es el único con puntos de vida.
   * @see haGanado
   * @returns {boolean}
   */
  haSobrevivido() {
    // Quito del array a los monstruos eliminados
    this.jugadores = this.jugadores.filter(
      (element) => element.estado !== ELIMINADO
    );
    // Si en el array solo hay un monstruo eso implica que es el ganador, o si ha llegado a los puntos necesarios
    if (this.jugadores.length === 1 || this.jugadorActivo.haGanado()) {
      return true;
    }
  }

  /**
   * @description Método que hace visible la pantalla de inicio, oculta y reinicia la pantalla de juego.
   * @see reiniciarTiradas
   */
  finalizarJuego() {
    $("#inicio").removeClass(OCULTO);
    $("#mesa").addClass(OCULTO);
    $("#info").addClass(OCULTO);
    $("#resumen").html(``);
    this.reiniciarTiradas();
    this.monstruoEnTokyo = undefined;
  }

  /**
   * @description Método que permite reproducir más de una vez un efecto de sonido sin dar errores.
   * @param efecto {$ElementType}
   */
  efectoDeSonido(efecto) {
    ///Solución tomada de https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
    // Si la promesa retorna un error, con el catch se captura y se ignora.
    if (efecto !== undefined) {
      efecto.then((_) => {}).catch((error) => {});
    }
  }

  /**
   * @description Método que se encarga de poner un monstruo en Tokyo
   * @see salirDeTokyo
   * @see entrarEnTokyo
   * @see moverATokyo
   */
  tomarTokyo() {
    // Si Tokyo no está vacío, se quita el monstruos que está en Tokyo
    if (this.monstruoEnTokyo !== undefined) {
      this.monstruoEnTokyo.salirDeTokyo();
      this.monstruoEnTokyo.enTokyo = false;
    }
    // y se cambia por el jugador/monstruo actual.
    // Si Tokyo está vacío, directamente pone al jugador/monstruo activo en Tokyo
    this.jugadorActivo.entrarEnTokyo();
    this.monstruoEnTokyo = this.jugadorActivo;
    moverATokyo(this.jugadorActivo);
  }

  /**
   * @description Método que pregunta al jugador/monstruos que está en Tokyo y tiene puntos de vida, si quiere abandonar
   * la ciudad. En caso afirmativo se llama al método tomarTokyo para realizar el cambio.
   * @see tomarTokyo
   */
  rendirTokyo() {
    if (
      this.monstruoEnTokyo.vidaActual === 0 ||
      confirm(
        `Jugador ${this.monstruoEnTokyo.nJUgador}, ¿Aceptas abandonar Tokyo?`
      ) === true
    ) {
      return this.tomarTokyo();
    }
  }

  /**
   * @description Método que aplica la cantidad de vida ganada al monstruo/jugador actual
   * @param cantidad
   * @see ganarVida
   */

  ganarVida(cantidad) {
    this.jugadorActivo.ganarVida(cantidad);
  }

  /**
   * @description Método que aplica la cantidad de vida perdida al monstruo/jugador actual
   * @param cantidad
   * @see perderVida
   */
  perderVida(cantidad) {
    this.jugadorActivo.perderVida(cantidad);
  }

  /**
   * @description Método que aplica la cantidad de estrellas ganadas al monstruo/jugador actual
   * @param cantidad
   * @see ganarEstrellas
   */
  ganarEstrellas(cantidad) {
    this.jugadorActivo.ganarEstrellas(cantidad);
  }

  /**
   * @description Método que aplica la cantidad de estrellas perdidas al monstruo/jugador actual. Se utilizará en
   * próximas versiones del juego
   * @param cantidad
   * @see perderEstrellas
   */
  perderEstrellas(cantidad) {
    this.jugadorActivo.perderEstrellas(cantidad);
  }

  /**
   * @description Método que aplica la cantidad de energía ganada al monstruo/jugador actual
   * @param cantidad
   * @see ganarEnergia
   */
  ganarEnergia(cantidad) {
    this.jugadorActivo.ganarEnergia(cantidad);
  }

  /**
   * @description Método que aplica la cantidad de energía perdida al monstruo/jugador actual Se utilizará en próximas
   * versiones del juego
   * @param cantidad
   * @see perderEnergia
   */
  perderEnergia(cantidad) {
    this.jugadorActivo.perderEnergia(cantidad);
  }

  /**
   * @description Método que calcula el daño inflingido por el jugador/monstruo actual
   * @param cantidad
   * @see tomarTokyo
   * @see heridasDesdeTokyo
   * @see perderVida
   * @see rendirTokyo
   */
  calcularHeridas(cantidad) {
    // Si Tokyo está vacío, este jugador tiene que entrar en el
    if (this.monstruoEnTokyo === undefined) this.tomarTokyo();
    // Si se encuentra en Tokyo hace daño desde Tokyo
    if (this.jugadorActivo.enTokyo) return this.heridasDesdeTokyo(cantidad);
    // Si el jugador activo no esta en Tokyo y hace daño al que si lo está
    this.monstruoEnTokyo.perderVida(cantidad);
    // Una vez aplicado el daño al monstruos/jugador que ocupa Tokyo, se le da la opción de salir de la ciudad
    this.rendirTokyo();
  }

  /**
   * @description Método que aplica el daño de todos los demás jugadores/monstruos que no están en Tokyo
   * @param cantidad
   * @see perderVida
   */
  heridasDesdeTokyo(cantidad) {
    for (const jugador of this.jugadores) {
      if (jugador !== this.jugadorActivo) jugador.perderVida(cantidad);
    }
  }

  /**
   * @description Método que almacena al jugador/monstruo ganador, emite un sonido y sale a la pantalla de victoria
   * @param jugador
   * @see efectoDeSonido
   * @see mostrarGanador
   */
  haGanado(jugador) {
    this.ganador = jugador.nJUgador;
    this.efectoDeSonido(this.$eleWin.play());
    this.mostrarGanador();
  }

  /**
   * @description Método que muestras la pantalla de victoria y muestra por pantalla al ganador y su avatar
   */
  mostrarGanador() {
    let $eleGanador = $("#ganador");
    $eleGanador.removeClass(OCULTO);
    $eleGanador
      .children("section")
      .children("h1")
      .html(`<h1>El Rey de Tokyo es:</h1><h2>El jugador ${this.ganador}</h2>`);
    $eleGanador
      .children("section")
      .children("img")
      .attr("src", `./src/assets/img/avatares/${this.ganador}win.jpg`);
  }

  /**
   * @description Método que reinicia el juego, para una nueva partida.
   * @see finalizarJuego
   */
  volverAJugar() {
    this.finalizarJuego();
  }
}
