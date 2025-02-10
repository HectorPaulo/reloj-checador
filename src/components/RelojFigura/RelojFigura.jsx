/* eslint-disable no-unused-vars */
import React from 'react'; // Importa la biblioteca React
import './RelojFigura.css'; // Importa el archivo CSS para los estilos del componente

const RelojFigura = () => {
    return (
        <div className="face"> {/* Contenedor principal del reloj */}
            <p className="v-index">II</p> {/* Índice vertical del reloj */}
            <p className="h-index">II</p> {/* Índice horizontal del reloj */}
            <div className="hand"> {/* Contenedor de las manecillas del reloj */}
                <div className="hand"> {/* Contenedor adicional para las manecillas */}
                    <div className="hour"></div> {/* Manecilla de la hora */}
                    <div className="minute"></div> {/* Manecilla de los minutos */}
                    <div className="second"></div> {/* Manecilla de los segundos */}
                </div>
            </div>
        </div>
    );
};

export default RelojFigura; // Exporta el componente para su uso en otros archivos
