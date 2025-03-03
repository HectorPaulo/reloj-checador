import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { getDefectos } from '../../../controllers/controller';
import Loader from '../../Loader/Loader';

const DetallesProyectoModal = ({ isOpen, onRequestClose, projectId }) => {
  const [defectos, setDefectos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDefectos = async () => {
      try {
        const defectosData = await getDefectos(projectId);
        setDefectos(defectosData);
      } catch (error) {
        console.error('Error al buscar los defectos: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDefectos();
    }
  }, [isOpen, projectId]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className='flex items-center justify-center p-4 sm:p-8'
      overlayClassName='fixed inset-0 flex items-center justify-center backdrop-blur-lg'
      contentLabel='Detalles del Proyecto'
    >
      <div className='w-full max-w-full bg-gradient-to-l from-gray-900 to-gray-700 p-6 rounded-lg shadow-lg'>
        <h3 className='text-white font-semibold text-2xl sm:text-3xl lg:text-8xl mb-4'>Defectos Encontrados</h3>
        <div className='max-h-96 overflow-y-auto'>
          {isLoading ? (
            <Loader />
          ) : defectos.length > 0 ? (
            <>
              <h3 className='text-white font-semibold text-xl sm:text-2xl lg:text-3xl mb-2'>Defectos del proyecto</h3>
              <ul className='space-y-4'>
                {defectos.map((defecto, index) => (
                  <li key={index} className='border-b pb-2'>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Defecto {index + 1}</span>
                      <span className='text-gray-600'>{defecto.fechaError}</span>
                    </div>
                    <div className='mt-2'>
                      <p><strong>Tipo de Error:</strong> {defecto.tipoError}</p>
                      <p><strong>Encontrado:</strong> {defecto.encontrado}</p>
                      <p><strong>Removido:</strong> {defecto.removido}</p>
                      <p><strong>Tiempo de Compostura:</strong> {defecto.tiempoCompostura}</p>
                      <p><strong>Arreglado:</strong> {defecto.arreglado ? 'Sí' : 'No'}</p>
                      <p><strong>Descripción:</strong> {defecto.descripcionError}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className='my-20 flex justify-center items-center'>
              <div className="group cursor-pointer hover:skew-x-6 hover:-skew-y-6 hover:duration-500 duration-500 group-hover:duration-500 overflow-hidden relative rounded-2xl shadow-inner shadow-gray-50 flex flex-col justify-around items-center w-40 h-80 bg-neutral-900 text-gray-50">
                <div className="after:duration-500 before:duration-500 duration-500 group-hover:before:translate-x-11 group-hover:before:-translate-y-11 group-hover:after:translate-x-11 group-hover:after:translate-y-16 after:absolute after:bg-orange-400 after:rounded-full after:-z-10 after:blur-xl after:bottom-32 after:right-16 after:w-12 after:h-12 before:absolute before:bg-sky-400 before:rounded-full before:-z-10 before:blur-xl before:top-20 before:right-16 before:w-12 before:h-12 flex flex-col font-extrabold text-6xl z-10">
                  <p className='text-lg justify-center mx-2 flex items-center'>No hay defectos disponibles.</p>
                </div>
                <div className="flex flex-row justify-center text-sm items-center gap-1 font-thin">
                  <span>¡Bien hecho!</span>
                  <svg y="0" xmlns="http://www.w3.org/2000/svg" x="0" width="100" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" height="100" className="w-4 h-4 stroke-current">
                    <path strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" fill="none" d="M33.9,46V29.9a16.1,16.1,0,0,1,32.2,0M50,62v8.1m-24.1,16H74.1a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H25.9a8,8,0,0,0-8,8V78.1A8,8,0,0,0,25.9,86.1Z">
                    </path>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='flex justify-center'>
          <button
            className='rounded-xl bg-gradient-to-r from-blue-800 to-blue-950 text-xl font-semibold text-white w-1/2 px-4 py-4 my-4 cursor-pointer hover:scale-110 hover:animate-pulse hover:bg-gradient-to-r hover:from-green-500 hover:to-green-900 hover:via-green-700'
            onClick={onRequestClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

DetallesProyectoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default DetallesProyectoModal;