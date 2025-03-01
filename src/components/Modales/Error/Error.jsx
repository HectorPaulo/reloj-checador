import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const ErrorModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const defaultFormData = {
    fechaError: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    tipoError: '',
    encontrado: '',
    removido: '',
    arreglado: false,
    descripcionError: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultFormData);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData); // Agrega este console.log para verificar los datos del formulario
    await onSubmit(formData); // Enviar los datos del formulario y esperar a que se complete
    onRequestClose(); // Cerrar el modal después de enviar los datos
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de la Actividad"
      className="flex w-full items-center justify-center"
      overlayClassName="fixed inset-0 flex items-center justify-center backdrop-blur-md"
    >
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-2xl w-full max-w-md md:max-w-lg lg:max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label className="block text-xl font-semibold text-white mb-2" htmlFor="fechaError">Fecha cuando se encontró el error</label>
            <input className='rounded-xl max-w-full border-2 p-4 font-semibold' type="date" name="fechaError" id="fechaError" value={formData.fechaError} onChange={handleChange} />
          </div> */}
          <div>
            <label className="block text-white text-xl font-semibold mb-2" htmlFor="tipoError">Tipo de defecto</label>
            <select className="rounded-xl border-2 p-4 w-full font-semibold text-lg" name="tipoError" id="tipoError" value={formData.tipoError} onChange={handleChange}>
              <option value="">Seleccione una opción</option>
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
            <label className="block text-white text-xl font-semibold mb-2" htmlFor="encontrado">Encontrado</label>
            <select className="rounded-xl border-2 p-4 w-full font-semibold text-lg" name="encontrado" id="encontrado" value={formData.encontrado} onChange={handleChange}>
              <option value="">Seleccione una opción</option>
              <option value="planificacion">Planificacion</option>
              <option value="diseno">Diseño</option>
              <option value="codigo">Código</option>
              <option value="compilacion">Compilación</option>
              <option value="pruebas">Pruebas</option>
              <option value="postMortem">Post mortem</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="text-white font-semibold text-lg" htmlFor="arreglado">Defecto arreglado</label>
            <input className="mx-4" type="checkbox" name="arreglado" id="arreglado" checked={formData.arreglado} onChange={handleChange} />
          {formData.arreglado && (
          <div>
            <label className="block text-xl font-semibold text-white mb-2" htmlFor="removido">Removido</label>
            <select className="rounded-xl border-2 text-lg font-semibold p-4 w-full" name="removido" id="removido" value={formData.removido} onChange={handleChange}>
              <option value="">Seleccione una opción</option>
              <option value="planificacion">Planificacion</option>
              <option value="diseno">Diseño</option>
              <option value="codigo">Código</option>
              <option value="compilacion">Compilación</option>
              <option value="pruebas">Pruebas</option>
              <option value="postMortem">Post mortem</option>
            </select>
          </div>
            
          )}
          </div>
            <div>
              <label className="block text-xl font-semibold text-white mb-2" htmlFor="descripcionError">Comentarios</label>
              <textarea placeholder='' className="rounded-xl border-2 p-4 w-full" name="descripcionError" id="descripcionError" cols="30" rows="4" value={formData.descripcionError} onChange={handleChange}></textarea>
            </div>
          <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
            <button onClick={onRequestClose} type="button" className="bg-gradient-to-l from-red-500 via-red-700 to-red-900 font-semibold text-lg text-white px-8 py-4 rounded-xl cursor-pointer hover:scale-110 w-full">Cerrar</button>
            <button type="submit" className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 font-semibold text-lg text-white px-8 py-4 rounded-xl cursor-pointer hover:scale-110 w-full">Aceptar</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defecto: PropTypes.object,
};

export default ErrorModal;