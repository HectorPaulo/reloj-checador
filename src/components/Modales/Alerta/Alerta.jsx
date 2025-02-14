/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const AlertaModal = ({ isOpen, onRequestClose }) => {
  // Efecto para reproducir el sonido de la alarma cuando la alerta se abre
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio('/public/papuSonido.mp3'); // Ruta al archivo de sonido de alarma
      audio.play().catch((error) => {
        console.error('Error al reproducir el sonido de la alarma: ', error);
      });

      // Limpiar el audio cuando el componente se desmonte o la alerta se cierre
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Alerta de Tiempo"
      className="flex w-100 items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="font-bold text-white text-3xl mb-4">¡Alerta de Tiempo!</h2>
        <p className="text-white text-lg">Has alcanzado los 30 segundos de actividad.</p>
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

AlertaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default AlertaModal;