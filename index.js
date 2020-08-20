import { Mazo } from "./src/class/Mazo.js";
import { Juego } from "./src/class/Juego.js";

let juego = new Juego();
let $eleJugar = $("#jugar");
let ajax = new XMLHttpRequest();
ajax.open("GET", "data_base/consultaBd.php");
ajax.send();
ajax.addEventListener("readystatechange", tratarAjax);

/**@description  deshabilito el botón Jugar para evitar que se pulse sin haber seleccionado el número de jugadores*/
$eleJugar.prop("disabled", true);

/**@description Cuando en el select se indique un número de jugadores, por medio de la función habilitar botón,se
 * elimina la propiedad disabled del botón jugar*/
$("#nJugadores").change(habilitarBoton);

$eleJugar.click(function () {
  juego.iniciarJuego();
});

$("ul").click(function (eve) {
  juego.seleccionarDado($(eve.target), eve.target.tagName);
});

$("#lanzar").click(function () {
  juego.tirarDados();
});

$("#terminar").click(function () {
  juego.resolverTirada();
});

$("#salir").click(finalizarJuego);

$("#volverAJugar").click(volverAJugar);

function habilitarBoton() {
  $("#jugar").prop("disabled", false);
}

/**
 * @description Cuando es el estado de la petición Ajax se ha realizado con exito, almaceno el texto recibido de la
 * petición, creo un objeto Mazo y por medio del método llenarMazo lleno de objetos Carta el objeto objMazo
 * @param eve {event}
 * @see llenarMazo
 */
function tratarAjax(eve) {
  if (this.readyState === 4 && this.status === 200) {
    let texto = this.responseText.trim();
    let objMazo = new Mazo();
    objMazo.llenarMazo(texto);
    juego.mazoCartas = objMazo;
  }
}

function volverAJugar() {
  juego.volverAJugar();
}

function finalizarJuego() {
  juego.finalizarJuego();
}
