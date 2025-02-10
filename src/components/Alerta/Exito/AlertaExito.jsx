/* eslint-disable no-unused-vars */
// Importa React y el hook useEffect desde la biblioteca de React
import React, { useEffect } from 'react';
// Importa PropTypes para la validación de tipos de las props
import PropTypes from 'prop-types';

// Define el componente funcional AlertaExito que recibe las props mensaje y onClose
const AlertaExito = ({ mensaje, onClose }) => {
  // Utiliza el hook useEffect para ejecutar código después de que el componente se monte
  useEffect(() => {
    // Configura un temporizador que llama a la función onClose después de 5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 segundos antes de desaparecer

    // Limpia el temporizador si el componente se desmonta antes de que el temporizador se complete
    return () => clearTimeout(timer);
  }, [onClose]); // El efecto depende de la función onClose

  // Renderiza el componente
  return (
    // Contenedor principal del mensaje de alerta, con clases de Tailwind CSS para el estilo
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        // Contenedor del mensaje de éxito, con clases de Tailwind CSS para el estilo
        className="bg-green-600 text-white p-4 rounded-lg shadow-lg animate-slide-in-out flex items-center"
        // Evita que el evento de clic se propague al contenedor principal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mr-4">
          {/* Icono SVG de verificación */}
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
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <div className="flex-grow">
          {/* Muestra el mensaje pasado como prop */}
          <span>{mensaje}</span>
        </div>
        {/* Botón para cerrar la alerta, llama a la función onClose cuando se hace clic */}
        <button onClick={onClose} className="ml-4 text-white text-2xl">
          &times;
        </button>
      </div>
    </div>
  );
};

// Define los tipos de las props que el componente espera recibir
AlertaExito.propTypes = {
  mensaje: PropTypes.string.isRequired, // mensaje debe ser una cadena y es obligatorio
  onClose: PropTypes.func.isRequired, // onClose debe ser una función y es obligatorio
};

// Exporta el componente para que pueda ser utilizado en otros archivos
export default AlertaExito;
