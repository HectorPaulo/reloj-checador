/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'; // Importa React y algunos hooks
import Modal from 'react-modal'; // Importa el componente Modal de react-modal
import PropTypes from 'prop-types'; // Importa PropTypes para la validación de tipos

// Define el componente EditarModal
const EditarModal = ({ isOpen, onRequestClose, inputValue, setInputValue, handleEditSubmit }) => {
  const inputRef = useRef(null); // Crea una referencia para el input
  const [error, setError] = useState(''); // Estado para manejar errores

  // useEffect para manejar eventos de teclado y enfoque del input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') { // Si la tecla presionada es Enter
        e.preventDefault();
        if (inputValue.trim() === '') { // Verifica si el input está vacío
          setError('El nombre de la actividad no puede estar vacío'); // Establece un mensaje de error
        } else {
          handleEditSubmit(); // Llama a la función de envío
        }
      } else if (e.key === 'Escape') { // Si la tecla presionada es Escape
        onRequestClose(); // Cierra el modal
      }
    };

    if (isOpen) { // Si el modal está abierto
      window.addEventListener('keydown', handleKeyDown); // Añade el evento de teclado
      if (inputRef.current) {
        inputRef.current.focus(); // Enfoca el input
      }
    } else {
      window.removeEventListener('keydown', handleKeyDown); // Remueve el evento de teclado
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Limpia el evento de teclado al desmontar
    };
  }, [isOpen, handleEditSubmit, onRequestClose, inputValue]); // Dependencias del useEffect

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (inputValue.trim() === '') { // Verifica si el input está vacío
      setError('El nombre de la actividad no puede estar vacío'); // Establece un mensaje de error
    } else {
      handleEditSubmit(); // Llama a la función de envío
      setError(''); // Limpia el mensaje de error
    }
  };

  return (
    <Modal
      isOpen={isOpen} // Controla si el modal está abierto
      onRequestClose={onRequestClose} // Función para cerrar el modal
      contentLabel="Editar Actividad" // Etiqueta de contenido para accesibilidad
      className="flex flex-col items-center justify-center bg-gray-700 p-12 rounded-lg" // Clases de estilo para el modal
      overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-sm" // Clases de estilo para el overlay
    >
      <h2 className="text-white text-xl font-semibold mb-4">Editar nombre de la actividad</h2> {/* Título del modal */}
      <input
        ref={inputRef} // Referencia del input
        type="text" // Tipo de input
        value={inputValue} // Valor del input
        onChange={(e) => setInputValue(e.target.value)} // Maneja el cambio del input
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-black" // Clases de estilo para el input
      />
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Muestra el mensaje de error si existe */}
      <button onClick={handleSubmit} className="px-6 py-2 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110">Guardar</button> {/* Botón para guardar */}
    </Modal>
  );
};

// Define los tipos de las props del componente
EditarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen debe ser un booleano y es requerido
  onRequestClose: PropTypes.func.isRequired, // onRequestClose debe ser una función y es requerido
  inputValue: PropTypes.string.isRequired, // inputValue debe ser una cadena y es requerido
  setInputValue: PropTypes.func.isRequired, // setInputValue debe ser una función y es requerido
  handleEditSubmit: PropTypes.func.isRequired, // handleEditSubmit debe ser una función y es requerido
};

export default EditarModal; // Exporta el componente