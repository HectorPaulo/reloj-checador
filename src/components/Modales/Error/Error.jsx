/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const ErrorModal = ({isOpen, onRequestClose}) =>{

  return (
     <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de la Actividad"
      className="flex w-100 items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
     >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <form action="" className="space-y-4">
          <div>
            <label className="block text-white mb-2" htmlFor="fechaError">Fecha cuando se encontró el error</label>
            <input className='rounded border p-2 w-full' type="date" name="fechaError" id="fechaError" placeholder={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="tipoError">Tipo de defecto</label>
            <select className="rounded border p-2 w-full" name="tipoError" id="tipoError">
              <option value="documentacion">10. Documentación</option>
              <option value="sintaxis">20. Sintáxis</option>
              <option value="construccion">30. Construcción, Empacar</option>
              <option value="asignacion">40. Asignación</option>
              <option value="interfaz">50. Interfaz</option>
              <option value="chequeo">60. Chequeo</option>
              <option value="datos">70. Datos</option>
              <option value="funcion">80. Función</option>
              <option value="sistema">90. Sistema</option>
              <option value="ambiente">100. Ambiente</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="encontrado">Encontrado</label>
            <select className="rounded border p-2 w-full" name="encontrado" id="encontrado">
              <option value="planificacion">Planificacion</option>
              <option value="diseno">Diseño</option>
              <option value="codigo">Código</option>
              <option value="compilacion">Compilación</option>
              <option value="pruebas">Pruebas</option>
              <option value="postMortem">Post mortem</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="removido">Removido</label>
            <select className="rounded border p-2 w-full" name="removido" id="removido">
              <option value="planificacion">Planificacion</option>
              <option value="diseno">Diseño</option>
              <option value="codigo">Código</option>
              <option value="compilacion">Compilación</option>
              <option value="pruebas">Pruebas</option>
              <option value="postMortem">Post mortem</option>
            </select>
          </div>
          <div className="flex items-center">
            <input className="mr-2" type="checkbox" name="arreglado" id="arreglado" />
            <label className="text-white" htmlFor="arreglado">Defecto arreglado</label>
          </div>
          <div>
            <label className="block text-white mb-2" htmlFor="descripcionError">Comentarios</label>
            <textarea className="rounded border p-2 w-full" name="descripcionError" id="descripcionError" cols="30" rows="4"></textarea>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Aceptar</button>
          </div>
        </form>
      </div>
     </Modal>
    );
   };
   
   ErrorModal.propTypes = {
     isOpen: PropTypes.bool.isRequired,
     onRequestClose: PropTypes.func.isRequired,
   };

export default ErrorModal;