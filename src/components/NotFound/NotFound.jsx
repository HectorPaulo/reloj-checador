/* eslint-disable no-unused-vars */

import React from 'react'; // Importa la biblioteca React
import './NotFound.css'; // Importa el archivo de estilos CSS

const NotFound = () => {
  return (
    <div className="main_wrapper"> {/* Contenedor principal */}
      <div className="main"> {/* Contenedor secundario */}
        <div className="antenna"> {/* Contenedor de la antena */}
          <div className="antenna_shadow"></div> {/* Sombra de la antena */}
          <div className="a1"></div> {/* Parte de la antena */}
          <div className="a1d"></div> {/* Parte de la antena */}
          <div className="a2"></div> {/* Parte de la antena */}
          <div className="a2d"></div> {/* Parte de la antena */}
          <div className="a_base"></div> {/* Base de la antena */}
        </div>
        <div className="tv"> {/* Contenedor del televisor */}
          <div className="cruve"> {/* Contenedor de la curva */}
            <svg
              className="curve_svg"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 189.929 189.929"
              xmlSpace="preserve"
            >
              <path
                d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
        C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
              ></path> {/* SVG que dibuja una curva */}
            </svg>
          </div>
          <div className="display_div"> {/* Contenedor de la pantalla */}
            <div className="screen_out"> {/* Contenedor externo de la pantalla */}
              <div className="screen_out1"> {/* Contenedor interno de la pantalla */}
                <div className="screen"> {/* Pantalla */}
                  <span className="notfound_text"> NOT FOUND</span> {/* Texto "NOT FOUND" */}
                </div>
                <div className="screenM"> {/* Pantalla secundaria */}
                  <span className="notfound_text"> NOT FOUND</span> {/* Texto "NOT FOUND" */}
                </div>
              </div>
            </div>
          </div>
          <div className="lines"> {/* Contenedor de las líneas */}
            <div className="line1"></div> {/* Línea 1 */}
            <div className="line2"></div> {/* Línea 2 */}
            <div className="line3"></div> {/* Línea 3 */}
          </div>
          <div className="buttons_div"> {/* Contenedor de los botones */}
            <div className="b1"><div></div></div> {/* Botón 1 */}
            <div className="b2"></div> {/* Botón 2 */}
            <div className="speakers"> {/* Contenedor de los altavoces */}
              <div className="g1">
                <div className="g11"></div> {/* Parte del altavoz */}
                <div className="g12"></div> {/* Parte del altavoz */}
                <div className="g13"></div> {/* Parte del altavoz */}
              </div>
              <div className="g"></div> {/* Parte del altavoz */}
              <div className="g"></div> {/* Parte del altavoz */}
            </div>
          </div>
        </div>
        <div className="bottom"> {/* Contenedor de la base */}
          <div className="base1"></div> {/* Parte de la base */}
          <div className="base2"></div> {/* Parte de la base */}
          <div className="base3"></div> {/* Parte de la base */}
        </div>
      </div>
      <div className="text_404"> {/* Contenedor del texto 404 */}
        <div className="text_4041">4</div> {/* Número 4 */}
        <div className="text_4042">0</div> {/* Número 0 */}
        <div className="text_4043">4</div> {/* Número 4 */}
      </div>
    </div>
  );
};

export default NotFound; // Exporta el componente NotFound