import { nuevoResultado, imagenDeResultado } from "../scripts/acciones.js";

const SELECT_CSS_CLASS = "seleccionado";

/**
 * @description Clase que define la imagen de un dado, donde se encentra en el DOM y su resultado numerico
 *
 */
export class Dado {
  constructor(elemento) {
    this.$elemento = $(elemento);
    this.resultado = 0;
    this.imagen = "";
  }

  /**
   * @description Método que asigna una imagen al dado en función
   * @see nuevoResultado
   * @see imagenDeResultado
   */
  lanzarDado() {
    this.resultado = nuevoResultado();
    this.imagen = imagenDeResultado(this.resultado);
    this.$elemento.attr("src", this.imagen);
  }

  /**
   * @description Método que evalua si el elemento está o no seleccionado por medio de su clases.
   * @return {boolean}
   */
  estaSeleccionado() {
    return this.$elemento.hasClass(SELECT_CSS_CLASS);
  }

  seleccionar() {
    if (this.estaSeleccionado()) return;
    this.$elemento.addClass(SELECT_CSS_CLASS);
  }

  desSeleccionar() {
    if (!this.estaSeleccionado()) return;
    this.$elemento.removeClass(SELECT_CSS_CLASS);
  }
}
