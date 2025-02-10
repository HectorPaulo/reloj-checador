/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ComentariosModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [comentarios, setComentarios] = useState('');

  const handleSubmit = () => {
    onSubmit(comentarios);
    setComentarios('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Comentarios de la Actividad"
      className="flex w-100 items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="font-bold text-white text-3xl mb-4">Comentarios de la Actividad</h2>
        <textarea
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black"
          placeholder="Escribe tus comentarios aquí..."
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
        />
        <button
          className="mt-4 rounded border bg-transparent cursor-pointer font-semibold text-white hover:scale-110 hover:text-black hover:bg-white px-4 py-2"
          onClick={handleSubmit}
        >
          Guardar
        </button>
        <button
          className="mt-4 rounded border bg-transparent cursor-pointer font-semibold text-white hover:scale-110 hover:text-black hover:bg-white px-4 py-2"
          onClick={onRequestClose}
        >
          Cerrar
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