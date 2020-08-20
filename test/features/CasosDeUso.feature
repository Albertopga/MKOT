
@SeleccionarNumeroJugadores_01
  Feature: Seleccionar el número de jugadores que participarán en el juego.

   Scenario Outline: Seleccionar cantidad de jugadores
     Given La pantalla principal de selección de jugadores está visible
     And el botón de jugar es clickable
     When despliego el select con el número de jugadores
     And selecciono <número>
     And click en botón "Jugar"
     Then aparece la pantalla de juego con <número> tableros de monstruo
     And   <número> secciones de información
     Examples:

       | número  |
       | 2       |
       | 3       |
       | 4       |

Feature: Resolver la fase de lanzamiento de dados
  @TirarDados
  Scenario: Lanzar los dados primera vez
    Given en la pantalla de juego, siendo el jugador activo
    When hago click en el botón "Lanzar"
    And es la primera tirada
    Then los seis dados cambiarán de símbolo

  @SeleccionarDados
  Scenario: Seleccionar dados lanzados
    Given se han lanzado los dados
    When hago click sobre el dado que quiero seleccionar
    Then el dado se selecciona
    And conservará su resultado cuando se pulse de nuevo en "Lanzar"

  @LimiteTiradaDados
  Scenario: Controlar que se hagan tres tiradas como máximo por turno.
    Given se han realizado tres lanzamientos de dados
    When hago click en el botón "Lanzar"
    Then No tiene que cambiar el valor de ningún dado
    And el juego me recordará que debo pulsar el botón "Finalizar"

  @ResolverTirada
  Scenario: Finalizar lanzamiento de dados
    Given se ha hecho mínimo una tirada de dados
    When se ha pulsado el botón "Finalizar"
    Then se aplican los resultados de la tirada
    And se cambia al siguiente jugador

  @CalcularPuntosDeVictoria
  Scenario Outline: Realizar asignación de estrellas
    Given se ha pulsado el botón de "Finalizar"
    And se ha hecho mínimo una tirada de dados
    When se obtiene <cantidad> dados con el <número>
    Then se ganan <puntos>
    Examples:
      | número | cantidad | puntos |
      |   1    |    3     |   1    |
      |   1    |    4     |   2    |
      |   1    |    5     |   3    |
      |   1    |    6     |   4    |
      |   2    |    3     |   2    |
      |   2    |    4     |   3    |
      |   2    |    5     |   4    |
      |   2    |    6     |   4    |
      |   3    |    3     |   3    |
      |   3    |    4     |   4    |
      |   3    |    5     |   5    |
      |   3    |    6     |   6    |

  @AplicarEfectosDados
  Scenario Outline:  Resolver efectos de los dados
    Given se ha pulsado el botón de "Finalizar"
    And se ha hecho mínimo una tirada de dados
    When se obtiene el símbolo de <símbolo>
    Then <efecto> tanto como número de dados tengan ese símbolo
    Examples:
      | símbolo |       efecto            |
      |  garra  | los demás pierden vida  |
      | corazón | se gana vida            |
      |  rayo   | se gana energía         |

  @EntrarEnTokyo_01
  Scenario Outline: Entrar en Tokyo ocupado
    Given al finalizar la tirada de dados
    And se a obtenido, mínimo, un símbolo de garra
    And hay un monstruo en Tokyo
    When se da la opción de <opción_1>, al jugador que ocupa Tokyo
    Then el jugador activo <opción_2>

    Examples:
      | opción_1          | opción_2              |
      | seguir en Tokyo   | no entra  en Tokyo    |
      | salir de Tokyo    | entra en Tokyo        |

  @EntrarEnTokyo_02
  Scenario: Entrar en Tokyo vacío
    Given al finalizar la tirada de dados
    When se ha obtenido, mínimo, un símbolo de garra
    And Tokyo está vacío
    Then el jugador activo entra en Tokyo

