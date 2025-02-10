/* eslint-disable no-unused-vars */
// Importa React y el hook useEffect desde la biblioteca de React
import React, { useEffect } from 'react';
// Importa PropTypes para la validación de tipos de las props
import PropTypes from 'prop-types';

// Define el componente funcional AlertaAdvertencia que recibe las props mensaje y onClose
const AlertaAdvertencia = ({ mensaje, onClose }) => {
  // Utiliza el hook useEffect para ejecutar un efecto secundario cuando el componente se monta
  useEffect(() => {
    // Establece un temporizador que llama a la función onClose después de 5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 segundos antes de desaparecer

    // Limpia el temporizador cuando el componente se desmonta
    return () => clearTimeout(timer);
  }, [onClose]); // El efecto depende de la función onClose

  // Renderiza el contenido del componente
  return (
    // Contenedor principal con clases de Tailwind CSS para posicionamiento y estilo
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        // Contenedor de la alerta con clases de Tailwind CSS para estilo y animación
        className="bg-yellow-600 text-white p-4 rounded-lg shadow-lg animate-slide-in-out flex items-center"
        // Evita que el evento de clic se propague al contenedor principal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mr-4">
          {/* SVG de un icono de advertencia */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          {/* Muestra el mensaje de advertencia */}
          <span>{mensaje}</span>
        </div>
        {/* Botón para cerrar la alerta manualmente */}
        <button onClick={onClose} className="ml-4 text-white text-2xl">
          &times;
        </button>
      </div>
    </div>
  );
};

// Define los tipos de las props para el componente
AlertaAdvertencia.propTypes = {
  mensaje: PropTypes.string.isRequired, // mensaje debe ser una cadena y es requerido
  onClose: PropTypes.func.isRequired, // onClose debe ser una función y es requerido
};

// Exporta el componente para su uso en otros archivos
export default AlertaAdvertencia;
