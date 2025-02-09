/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const FinalizarModal = ({ isOpen, onRequestClose, actividad, minutos }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
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
  }, [isOpen, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Actividad Finalizada"
      className="flex flex-col items-center justify-center bg-gray-700 p-12 rounded-lg"
      overlayClassName="fixed inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-sm"
    >
      <h2 className="text-white text-xl font-semibold mb-4">Actividad Finalizada</h2>
      <p className="text-white mb-4">Actividad: {actividad}</p>
      <p className="text-white mb-4">Duración: {minutos} minutos</p>
      <button onClick={onRequestClose} className="px-6 py-2 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110">Cerrar</button>
    </Modal>
  );
};

FinalizarModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  actividad: PropTypes.string.isRequired,
  minutos: PropTypes.number.isRequired,
};

export default FinalizarModal;