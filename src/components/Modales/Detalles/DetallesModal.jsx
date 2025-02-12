// filepath: /home/paulo/Documentos/reloj-checador/src/components/Modales/Detalles/DetallesModal.jsx
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
            <h2 className="font-bold text-white text-3xl mb-4">Detalles de la Actividad</h2>
            <table className="min-w-full bg-gray-700">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-white">Campo</th>
                  <th className="py-2 px-4 text-left text-white">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Fecha:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.fecha}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Hora de Inicio:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.horaInicio}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Hora de Final:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.horaFinal}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Interrupción:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.interrupcion} segundos</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Tiempo:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.minutos} minutos</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Nombre de la Actividad:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.actividad}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Comentarios:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.comentarios}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Completada:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.completada ? 'Sí' : 'No'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-white"><strong>Unidades:</strong></td>
                  <td className="py-2 px-4 text-white">{actividad.unidades}</td>
                </tr>
              </tbody>
            </table>
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