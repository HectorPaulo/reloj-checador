import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { deleteProyecto } from '../../../controllers/controller';

const ConfirmarBorrar = ({ id, setBorrarModal, setBorrarId }) => {
    const handleClose = () => {
        setBorrarModal(false);
        setBorrarId(null);
    };

    const handleConfirm = async () => {
        try {
            await deleteProyecto(id);
            console.log('Proyecto borrado correctamente:', id);
            window.location.reload();
        } catch (error) {
            console.error('Error al borrar el proyecto:', error);
        }
        handleClose();
    };

    return (
        <Modal
            isOpen={!!id}
            onRequestClose={handleClose}
            contentLabel="¿Estás seguro de querer borrar este proyecto?"
            className="flex items-center justify-center"
            overlayClassName="fixed inset-0 backdrop-blur-lg flex items-center justify-center"
        >
            <div className="p-8 rounded-2xl max-w-full w-full bg-gradient-to-r from-gray-700 to-gray-800">
                <h2 className="font-bold text-white text-2xl mb-4">¿Estás seguro de querer borrar este proyecto?</h2>
                <p className="text-white mb-4">Si borras el proyecto no lo volverás a ver ni podrás recuperar ninguno de sus registros.</p>
                <div className="flex justify-end">
                    <button
                        className="mr-8 px-4 py-2 bg-gray-300 text-black font-semibold cursor-pointer hover:scale-110 hover:animate-pulse rounded hover:bg-gray-400"
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 font-semibold hover:scale-110 hover:animate-pulse cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleConfirm}
                    >
                        Borrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

ConfirmarBorrar.propTypes = {
    id: PropTypes.string,
    setBorrarModal: PropTypes.func.isRequired,
    setBorrarId: PropTypes.func.isRequired,
    // onConfirmDelete: PropTypes.func.isRequired,
};

export default ConfirmarBorrar;