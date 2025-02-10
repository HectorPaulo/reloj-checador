/* eslint-disable no-unused-vars */
// Importing necessary modules from React and other libraries
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

// Defining the ComentariosModal component and destructuring props
const ComentariosModal = ({ isOpen, onRequestClose, onSubmit }) => {
  // Using useState hook to manage the state of comentarios
  const [comentarios, setComentarios] = useState('');

  // Function to handle form submission
  const handleSubmit = () => {
    // Calling the onSubmit prop function with the comentarios state
    onSubmit(comentarios);
    // Resetting the comentarios state to an empty string
    setComentarios('');
  };

  // Returning the JSX to render the modal
  return (
    <Modal
      // Setting the modal's open state based on the isOpen prop
      isOpen={isOpen}
      // Setting the function to call when the modal should close
      onRequestClose={onRequestClose}
      // Setting the content label for accessibility
      contentLabel="Comentarios de la Actividad"
      // Applying custom class names for styling the modal content
      className="flex w-100 items-center justify-center"
      // Applying custom class names for styling the modal overlay
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        {/* Modal title */}
        <h2 className="font-bold text-white text-3xl mb-4">Comentarios de la Actividad</h2>
        {/* Textarea for user to input comments */}
        <textarea
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black"
          placeholder="Escribe tus comentarios aquí..."
          // Binding the textarea value to the comentarios state
          value={comentarios}
          // Updating the comentarios state when the textarea value changes
          onChange={(e) => setComentarios(e.target.value)}
        />
        {/* Button to submit the comments */}
        <button
          className="mt-4 rounded border bg-transparent cursor-pointer font-semibold text-white hover:scale-110 hover:text-black hover:bg-white px-4 py-2"
          // Calling handleSubmit function when the button is clicked
          onClick={handleSubmit}
        >
          Guardar
        </button>
        {/* Button to close the modal */}
        <button
          className="mt-4 rounded border bg-transparent cursor-pointer font-semibold text-white hover:scale-110 hover:text-black hover:bg-white px-4 py-2"
          // Calling onRequestClose prop function when the button is clicked
          onClick={onRequestClose}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

// Defining prop types for the ComentariosModal component
ComentariosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean and is required
  onRequestClose: PropTypes.func.isRequired, // onRequestClose should be a function and is required
  onSubmit: PropTypes.func.isRequired, // onSubmit should be a function and is required
};

// Exporting the ComentariosModal component as the default export
export default ComentariosModal;