/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const DetallesModal = ({ isOpen, onRequestClose, actividad }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de la Actividad"
      className="flex w-100 items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        {actividad ? (
          <>
            <div className="text-center">
              <h2 className="font-bold text-white text-3xl mb-4">Detalles de la Actividad</h2>
              <p className="font-bold text-lg my-2"><strong>Fecha:</strong> {actividad.fecha}</p>
              <p className="font-bold text-lg my-2"><strong>Hora de Inicio:</strong> {actividad.horaInicio}</p>
              <p className="font-bold text-lg my-2"><strong>Hora de Final:</strong> {actividad.horaFinal}</p>
              <p className="font-bold text-lg my-2"><strong>Interrupción:</strong> {actividad.interrupcion} segundos</p>
              <p className="font-bold text-lg my-2"><strong>Tiempo:</strong> {actividad.minutos} minutos</p>
              <p className="font-bold text-lg my-2"><strong>Nombre de la Actividad:</strong> {actividad.actividad}</p>
              <p className="font-bold text-lg my-2"><strong>Comentarios:</strong> {actividad.comentarios}</p>
              <p className="font-bold text-lg my-2"><strong>Completada:</strong> {actividad.completada ? 'Sí' : 'No'}</p>
              <p className="font-bold text-lg my-2"><strong>Unidades:</strong> {actividad.unidades}</p>
            </div>
          </>
        ) : (
          <p className="font-bold text-lg my-4">No hay detalles disponibles.</p>
        )}
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

DetallesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  actividad: PropTypes.object,
};

export default DetallesModal;