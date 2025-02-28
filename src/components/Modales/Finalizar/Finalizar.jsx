/* eslint-disable no-unused-vars */
// Importa las dependencias necesarias de React y otras librerías
import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

// Define el componente FinalizarModal que recibe props: isOpen, onRequestClose, actividad, minutos
const FinalizarModal = ({ isOpen, onRequestClose, actividad, minutos }) => {
  // Crea una referencia para el input
  const inputRef = useRef(null);

  // Hook de efecto que se ejecuta cuando el componente se monta y cuando isOpen o onRequestClose cambian
  useEffect(() => {
    // Define una función para manejar el evento de presionar una tecla
    const handleKeyDown = (e) => {
      // Si la tecla presionada es 'Escape', llama a onRequestClose
      if (e.key === 'Escape') {
        onRequestClose();
      }
    };

    // Si el modal está abierto, añade el evento de keydown al window y enfoca el input
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      // Si el modal está cerrado, remueve el evento de keydown del window
      window.removeEventListener('keydown', handleKeyDown);
    }

    // Limpia el evento de keydown cuando el componente se desmonta o cuando isOpen/onRequestClose cambian
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onRequestClose]);

  // Renderiza el modal con su contenido
  return (
    <Modal
      isOpen={isOpen} // Controla si el modal está abierto o cerrado
      onRequestClose={onRequestClose} // Función para cerrar el modal
      contentLabel="Actividad Finalizada" // Etiqueta de accesibilidad para el modal
      className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-500 to-gray-900 p-6 rounded-xl w-1/2 h-1/3" // Clases de estilo para el modal
      overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-xl" // Clases de estilo para el overlay del modal
    >
      <h2 className="text-white text-4xl font-bold my-auto">Actividad Finalizada</h2> {/* Título del modal */}
      <div className='flex flex-row items-center justify-center my-auto gap-3'> {/* Contenedor de la actividad y la duración */}
      <p className="text-white mb-4 text-xl font-semibold">Duración:</p> {/* Muestra la duración en minutos */}
      <p className="text-white mb-4 text-lg font-semibold">{minutos} minutos</p> {/* Muestra la duración en minutos */}
      </div>
      <button onClick={onRequestClose} className="px-15 py-3 my-auto bg-transparent bg-gradient-to-r from-blue-700 to-blue-800 text-white cursor-pointer rounded hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-950 hover:border-0 hover:animate-pulse font-semibold hover:scale-110">Cerrar</button> {/* Botón para cerrar el modal */}
    </Modal>
  );
};

// Define los tipos de las props que el componente espera recibir
FinalizarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen debe ser un booleano y es requerido
  onRequestClose: PropTypes.func.isRequired, // onRequestClose debe ser una función y es requerido
  actividad: PropTypes.string.isRequired, // actividad debe ser una cadena y es requerido
  minutos: PropTypes.number.isRequired, // minutos debe ser un número y es requerido
};

// Exporta el componente para que pueda ser usado en otros archivos
export default FinalizarModal;