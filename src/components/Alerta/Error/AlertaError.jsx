/* eslint-disable no-unused-vars */
// Importa React y el hook useEffect desde la biblioteca de React
import React, { useEffect } from 'react';
// Importa PropTypes para la validación de tipos de las props
import PropTypes from 'prop-types';

// Define el componente funcional AlertaError que recibe las props mensaje y onClose
const AlertaError = ({ mensaje, onClose }) => {
  // Utiliza el hook useEffect para ejecutar código después de que el componente se monte
  useEffect(() => {
    // Configura un temporizador que llamará a la función onClose después de 5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 segundos antes de desaparecer

    // Limpia el temporizador si el componente se desmonta antes de que el temporizador se complete
    return () => clearTimeout(timer);
  }, [onClose]); // El efecto depende de la función onClose

  // Renderiza el componente
  return (
    // Contenedor principal del modal, con clases de Tailwind CSS para el estilo
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        // Contenedor de la alerta con estilos de Tailwind CSS y una animación
        className="bg-red-600 text-white p-4 rounded-lg shadow-lg animate-slide-in-out flex items-center"
        // Evita que el evento de clic se propague al contenedor principal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mr-4">
          {/* Icono SVG de advertencia */}
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
              d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3.75a8.25 8.25 0 1 1-8.25 8.25A8.25 8.25 0 0 1 12 3.75z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          {/* Muestra el mensaje de error */}
          <span>{mensaje}</span>
        </div>
        {/* Botón para cerrar la alerta, llama a la función onClose al hacer clic */}
        <button onClick={onClose} className="ml-4 text-white text-2xl">
          &times;
        </button>
      </div>
    </div>
  );
};

// Define los tipos de las props para el componente AlertaError
AlertaError.propTypes = {
  mensaje: PropTypes.string.isRequired, // mensaje debe ser una cadena y es obligatorio
  onClose: PropTypes.func.isRequired, // onClose debe ser una función y es obligatorio
};

// Exporta el componente AlertaError como el valor por defecto del módulo
export default AlertaError;