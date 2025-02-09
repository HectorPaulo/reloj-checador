import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const EditarModal = ({ isOpen, onRequestClose, inputValue, setInputValue, handleEditSubmit }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (inputValue.trim() === '') {
          setError('El nombre de la actividad no puede estar vacío');
        } else {
          handleEditSubmit();
        }
      } else if (e.key === 'Escape') {
        onRequestClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleEditSubmit, onRequestClose, inputValue]);

  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      setError('El nombre de la actividad no puede estar vacío');
    } else {
      handleEditSubmit();
      setError('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar Actividad"
      className="flex flex-col items-center justify-center bg-gray-700 p-12 rounded-lg"
      overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-sm"
    >
      <h2 className="text-white text-xl font-semibold mb-4">Editar nombre de la actividad</h2>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-black"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={handleSubmit} className="px-6 py-2 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110">Guardar</button>
    </Modal>
  );
};

EditarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  handleEditSubmit: PropTypes.func.isRequired,
};

export default EditarModal;