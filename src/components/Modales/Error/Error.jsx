import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '/src/firebaseConfig';

const ErrorModal = ({ isOpen, onRequestClose, onSubmit, defecto, selectedProject }) => {
  const [formData, setFormData] = useState({
    fechaError: '',
    tipoError: '',
    encontrado: '',
    removido: '',
    arreglado: false,
    descripcionError: ''
  });

  useEffect(() => {
    if (defecto) {
      setFormData(defecto);
    }
  }, [defecto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);

    try {
      const user = auth.currentUser;
      if (user && selectedProject) {
        const docRef = await addDoc(collection(db, 'usuarios', user.uid, 'proyectos', selectedProject.id, 'defectos'), {
          fechaError: formData.fechaError,
          tipoError: formData.tipoError,
          encontrado: formData.encontrado,
          removido: formData.removido,
          arreglado: formData.arreglado,
          descripcionError: formData.descripcionError,
          tiempoCompostura: new Date().toISOString()
        });
        console.log("Documento añadido con ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error al añadir el documento: ", error);
    }

    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de la Actividad"
      className="flex w-full items-center justify-center"
      overlayClassName="fixed inset-0 flex items-center justify-center backdrop-blur-md"
    >
      <div className="bg-gradient-to-r from-gray-700 p-6 rounded-2xl max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xl font-semibold text-white mb-2" htmlFor="fechaError">Fecha cuando se encontró el error</label>
            <input className='rounded-xl max-w-full border-2 p-4 font-semibold' type="date" name="fechaError" id="fechaError" value={formData.fechaError} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-white text-xl  font-semibold mb-2" htmlFor="tipoError">Tipo de defecto</label>
            <select className="rounded-xl border-2 p-4 max-w-full font-semibold text-lg" name="tipoError" id="tipoError" value={formData.tipoError} onChange={handleChange}>
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
            <select className="rounded-xl border-2 p-4 font-semibold text-lg max-w-full" name="encontrado" id="encontrado" value={formData.encontrado} onChange={handleChange}>
              <option value="planificacion">Planificacion</option>
              <option value="diseno">Diseño</option>
              <option value="codigo">Código</option>
              <option value="compilacion">Compilación</option>
              <option value="pruebas">Pruebas</option>
              <option value="postMortem">Post mortem</option>
            </select>
          </div>
          <div>
            <label className="block text-xl font-semibold text-white mb-2" htmlFor="removido">Removido</label>
            <select className="rounded-xl border-2 text-lg font-semibold p-4 max-w-full" name="removido" id="removido" value={formData.removido} onChange={handleChange}>
              <option value="planificacion">Planificacion</option>
              <option value="diseno">Diseño</option>
              <option value="codigo">Código</option>
              <option value="compilacion">Compilación</option>
              <option value="pruebas">Pruebas</option>
              <option value="postMortem">Post mortem</option>
            </select>
          </div>
          <div className="flex items-center">
            <input className="mx-4" type="checkbox" name="arreglado" id="arreglado" checked={formData.arreglado} onChange={handleChange} />
            <label className="text-white font-semibold text-lg" htmlFor="arreglado">Defecto arreglado</label>
          </div>
          <div>
            <label className="block text-xl font-semibold  text-white mb-2" htmlFor="descripcionError">Comentarios</label>
            <textarea className="rounded-xl border-2 p-4 max-w-full" name="descripcionError" id="descripcionError" cols="30" rows="4" value={formData.descripcionError} onChange={handleChange}></textarea>
          </div>
          <div className='flex space-x-4'>
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
  selectedProject: PropTypes.object.isRequired, // Añadir validación de PropTypes
};

export default ErrorModal;