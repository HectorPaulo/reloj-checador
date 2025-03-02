/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ComentariosModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [comentarios, setComentarios] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(comentarios);
    setComentarios('');
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Comentarios de la Actividad"
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 flex items-center backdrop-blur-lg justify-center"
    >
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-500 to-gray-900 p-8 rounded-xl max-w-full">
        <h2 className="font-bold text-white text-6xl my-8">Comentarios</h2>
        <textarea
          className="w-full p-6 my-8 border-gray-300 rounded-lg bg-white text-black"
          placeholder="Escribe tus comentarios aquí..."
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
        />
        <button
          className="text-xl font-semibold bg-gradient-to-r from-green-500 to-green-700 rounded mx-12 px-8 py-4 cursor-pointer hover:scale-110 hover:animate-pulse"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  );
};

ComentariosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ComentariosModal;
