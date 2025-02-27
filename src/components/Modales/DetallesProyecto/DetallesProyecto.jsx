import Modal from 'react-modal';
import PropTypes from 'prop-types';

const DetallesProyecto = ({ isOpen, onRequestClose, proyecto }) => {
return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className='flex w-full items-center justify-center'
        overlayClassName='fixed inset-0 bg-gray-900 bg-opacity-50'
        contentLabel='Detalles del Proyecto'
    >
        <div className='mt-4 sm:mt-8'>
            <h3 className='text-white font-semibold justify-center text-6xl'>Defectos Encontrados</h3>
            {proyecto && proyecto.defecto ? (
                <>
                    <h3 className='text-white'>Defectos del proyecto</h3>
                    <ul>
                        {proyecto.defecto.map((defecto, index) => (
                            <li key={index}>
                                <div>{index + 1}</div>
                                <div>{defecto.fecha}</div>
                                <div>{defecto.tipoDefecto}</div>
                                <div>{defecto.encontrado}</div>
                                <div>{defecto.removido}</div>
                                <div>{defecto.tiempoCompostura}</div>
                                <div>{defecto.arreglado}</div>
                                <div>{defecto.descripcion}</div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
<div className='my-20 justify-center flex items-center'>
<div className="group cursor-pointer hover:skew-x-6 hover:-skew-y-6 hover:duration-500 duration-500 group-hover:duration-500 overflow-hidden relative  rounded-2xl shadow-inner shadow-gray-50 flex flex-col justify-around items-center w-40 h-80 bg-neutral-900 text-gray-50">
<div className="after:duration-500 before:duration-500 duration-500  group-hover:before:translate-x-11 group-hover:before:-translate-y-11  group-hover:after:translate-x-11 group-hover:after:translate-y-16 after:absolute  after:bg-orange-400 after:rounded-full after:-z-10 after:blur-xl after:bottom-32 after:right-16 after:w-12 after:h-12 before:absolute before:bg-sky-400 before:rounded-full before:-z-10 before:blur-xl before:top-20 before:right-16 before:w-12 before:h-12 flex flex-col font-extrabold text-6xl z-10">
                    <p className='text-lg justify-center mx-2 flex items-center'>No hay defectos deisponibles.</p>
</div>
<div className="flex flex-row justify-center text-sm items-center gap-1 font-thin">
    <span>¡Bien hecho!</span>
    <svg y="0" xmlns="http://www.w3.org/2000/svg" x="0" width="100" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" height="100" className="w-4 h-4 stroke-current">
    <path strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" fill="none" d="M33.9,46V29.9a16.1,16.1,0,0,1,32.2,0M50,62v8.1m-24.1,16H74.1a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H25.9a8,8,0,0,0-8,8V78.1A8,8,0,0,0,25.9,86.1Z">
    </path>
</svg></div>
</div>
</div>
            )}
            <div className='flex justify-center'>
                <button
                    className='mt-4 rounded border bg-transparent cursor-pointer font-semibold text-white hover:scale-110 hover:text-black hover:bg-white px-4 py-2'
                    onClick={onRequestClose}
                >
                    Aceptar
                </button>
            </div>
        </div>
    </Modal>
);
};

DetallesProyecto.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  proyecto: PropTypes.object.isRequired,
};

export default DetallesProyecto;