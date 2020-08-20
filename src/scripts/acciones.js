import { Monstruo } from "../class/Monstruo.js";

const ACTIVO = "activo";
const OCULTO = "oculto";

/**
 * @description Permite poner o quitar la clase css "activo" a un elemento pasado por parametro.La clase activo lo que
 * hace es generar un marco verde al elemento.
 * @param $elemento {$ElementType}
 */
export function resaltarElemento($elemento) {
  if ($elemento.hasClass(ACTIVO)) {
    $($elemento).removeClass(ACTIVO);
  } else {
    $($elemento).addClass(ACTIVO);
  }
}

/**
 * @description En función del contenido del select nJugadores, se va a generar esa cantidad de objeto Monstruo y
 * se van a almacenar en el array jugadores, que será usado como parámetro para llamar al método inicializarMonstruos,
 * que devolverá el mismo array con los Monstruos con sus valores inicializados.
 * @returns jugadores {Monstruo[]}
 */
export function prepararMonstruos() {
  let jugadores = [];
  let nJugadores = $("#nJugadores").val();

  /**
   * @description En base al número de jugadores, se añaden ese número de Monstruos y se ocultan o muestran distintas
   * zonas del HTML
   * @see resetear
   * @see inicializarMonstruos
   * @return {Monstruo[]}
   */
  switch (nJugadores) {
    case "2":
      jugadores.push(new Monstruo("j1"), new Monstruo("j2"));
      break;

    case "3":
      jugadores.push(
        new Monstruo("j1"),
        new Monstruo("j2"),
        new Monstruo("j3")
      );
      break;

    case "4":
      jugadores.push(
        new Monstruo("j1"),
        new Monstruo("j2"),
        new Monstruo("j3"),
        new Monstruo("j4")
      );
      break;
  }
  jugadores.forEach((monstruo) => monstruo.resetear());
  return inicializarMonstruos(jugadores);
}

/**
 * @description Permite hacer el cambio de pantalla una vez se inicia el juego
 * @see moverATokyo
 */
export function pintarTablero() {
  $("#inicio").addClass(OCULTO);
  $("#ganador").addClass(OCULTO);
  $("#info").removeClass(OCULTO);
  $("#mesa").removeClass(OCULTO);
  moverATokyo("");
}

/**
 * @description Muestra en el mensaje pasado por parámetro y el texto ya existente en la sección resumen, y centra la
 * vista en
 * el último elemento escrito.
 * @param mensaje {string}.
 * @see centrarScroll
 */
export function log(mensaje) {
  let $eleResumen = $("#resumen");
  let texto = $eleResumen.html();
  $eleResumen.html(`${texto + mensaje}`);
}

/**
 * @description Hace scroll para mostrar el último elemento
 */
export function centrarScroll() {
  let $elem = $("#resumen");
  let alturaScroll = $($elem).prop("scrollHeight");
  let posElemento = $("#resumen > *:last-child").offset().top;

  $($elem).animate(
    {
      scrollTop: alturaScroll + posElemento,
    },
    2000
  );
}

/**
 * @description Permite poner una imagen en la zona de Tokyo en base al monstruo indicado. Si monstruo es una cadena
 * vacía, se elimina el que estuviera puesto.
 * @param monstruo {Monstruo}
 */
export function moverATokyo(monstruo) {
  let src = monstruo ? `src/assets/img/avatares/${monstruo.nJUgador}.png` : "";
  $(".tokyo").attr("src", src);
}

/**
 * @description En base al resultado, se retorna una url de la imagen correspondiente al resultado
 * @param resultado {int}
 * @returns {string}
 */
export function imagenDeResultado(resultado) {
  switch (resultado) {
    case 1:
      return "./src/assets/img/dices/dice1.jpg";
    case 2:
      return "./src/assets/img/dices/dice2.jpg";
    case 3:
      return "./src/assets/img/dices/dice3.jpg";
    case 4:
      return "./src/assets/img/dices/diceAttack.jpg";
    case 5:
      return "./src/assets/img/dices/diceEnergy.jpg";
    case 6:
      return "./src/assets/img/dices/diceHealth.jpg";
    default:
      return "";
  }
}

/**
 * @description Genera un número aleatorio ente 1 y 6
 * @returns {int}
 */
export function nuevoResultado() {
  return Math.floor(Math.random() * (7 - 1) + 1);
}

/**
 * @description Asigna un número, una zona de juego en el HTML, zona de información en el HTML, miniatura y avatar a
 * cada Monstruos almacenado en el array recibido por parámetro. y se asegura de que no tenga la clase "activo".
 * @param monstruos {Monstruo[]}
 * @returns {Monstruo[]}
 */
function inicializarMonstruos(monstruos) {
  crearZonaInfoMonstruos(monstruos);

  for (let i = 0; i < monstruos.length; i++) {
    monstruos[i].nJUgador = i + 1;
    monstruos[i].zonaJuego = $(`#j${i + 1}`);
    monstruos[i].$eleTarjetaInfo = $(`#infoJ${i + 1}`);
    monstruos[i].$eleZonaPuntos = $(`#infoJ${i + 1}>.datos`);
    monstruos[i].$eleMiniatura = $(`#infoJ${i + 1}>img`);
    monstruos[i].avatar = `./src/assets/img/avatares/${i + 1}.jpg`;
    monstruos[i].resetear();
  }
  return monstruos;
}

/**
 * @description Añade la clase "activo" a un elemento HTML capturado por medio de Jquery
 * @param {$ElementType}
 */
function ocultarElemento($elemento) {
  $elemento.addClass(OCULTO);
}

/**
 * @description Quita la clase "activo" a un elemento HTML capturado por medio de Jquery
 * @param {$ElementType}
 */
function mostrarElemento($elemento) {
  $elemento.removeClass(OCULTO);
}

/**
 * @description Crea las zonas de juego de cada monstruo
 * @param {Monstruo[]}
 */
export function crearZonaInfoMonstruos(monstruos) {
  let $elContainer = $("#info > div");

  const reduceCallback = function (texto, _item, index) {
    const id = index + 1;
    return `${texto}<section class="infoJugador" id="infoJ${id}">
      <h1>Jugador ${id}</h1>
      <img src="./src/assets/img/avatares/${id}.jpg" alt="" />
        <article class="datos">
          <img src="./src/assets/img/estrella.png" alt="" />
          <p class="v"></p>
          <img src="./src/assets/img/corazon.png" alt="" />
          <p class="c"></p>
          <img src="./src/assets/img/energia.png" alt="" />
          <p class="e"></p>
        </article>
    </section>`;
  };
  const texto = monstruos.reduce(reduceCallback, "");
  $($elContainer).html(texto);
}
