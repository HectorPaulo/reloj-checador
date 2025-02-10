/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'; // Importa React y algunos hooks
import Modal from 'react-modal'; // Importa el componente Modal de react-modal
import PropTypes from 'prop-types'; // Importa PropTypes para la validación de tipos

const IniciarModal = ({ isOpen, onRequestClose, inputValue, setInputValue, handleModalSubmit }) => {
  const inputRef = useRef(null); // Crea una referencia para el input
  const [error, setError] = useState(''); // Estado para manejar mensajes de error

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') { // Si la tecla presionada es Enter
        e.preventDefault(); // Previene el comportamiento por defecto
        if (inputValue.trim() === '') { // Si el valor del input está vacío
          setError('El nombre de la actividad no puede estar vacío'); // Muestra un mensaje de error
        } else {
          handleModalSubmit(); // Llama a la función de envío del modal
        }
      } else if (e.key === 'Escape') { // Si la tecla presionada es Escape
        onRequestClose(); // Cierra el modal
      }
    };

    if (isOpen) { // Si el modal está abierto
      window.addEventListener('keydown', handleKeyDown); // Añade el evento de keydown al window
      if (inputRef.current) { // Si la referencia del input está disponible
        inputRef.current.focus(); // Enfoca el input
      }
    } else {
      window.removeEventListener('keydown', handleKeyDown); // Remueve el evento de keydown del window
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Limpia el evento de keydown al desmontar
    };
  }, [isOpen, handleModalSubmit, onRequestClose, inputValue]); // Dependencias del useEffect

  const handleSubmit = () => {
    if (inputValue.trim() === '') { // Si el valor del input está vacío
      setError('El nombre de la actividad no puede estar vacío'); // Muestra un mensaje de error
    } else {
      handleModalSubmit(); // Llama a la función de envío del modal
      setError(''); // Limpia el mensaje de error
    }
  };

  return (
    <Modal
      isOpen={isOpen} // Propiedad para abrir o cerrar el modal
      onRequestClose={onRequestClose} // Función para cerrar el modal
      contentLabel="Nombre de la Actividad" // Etiqueta de contenido para accesibilidad
      className="flex flex-col items-center justify-center bg-gray-700 p-12 rounded-lg" // Clases de estilo para el modal
      overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-sm" // Clases de estilo para el overlay
    >
      <h2 className="text-white text-xl font-semibold mb-4">Ingrese el nombre de la actividad</h2> {/* Título del modal */}
      <input
        ref={inputRef} // Referencia del input
        type="text" // Tipo de input
        value={inputValue} // Valor del input
        onChange={(e) => setInputValue(e.target.value)} // Maneja el cambio del input
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-black" // Clases de estilo para el input
      />
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Muestra el mensaje de error si existe */}
      <button onClick={handleSubmit} className="px-6 py-2 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110">Iniciar</button> {/* Botón para iniciar */}
    </Modal>
  );
};

IniciarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Valida que isOpen sea un booleano requerido
  onRequestClose: PropTypes.func.isRequired, // Valida que onRequestClose sea una función requerida
  inputValue: PropTypes.string.isRequired, // Valida que inputValue sea una cadena requerida
  setInputValue: PropTypes.func.isRequired, // Valida que setInputValue sea una función requerida
  handleModalSubmit: PropTypes.func.isRequired, // Valida que handleModalSubmit sea una función requerida
};

export default IniciarModal; // Exporta el componente