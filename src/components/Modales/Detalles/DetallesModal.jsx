/* eslint-disable no-unused-vars */
// Importa React para poder usar JSX
import React from 'react';
// Importa PropTypes para la validación de tipos de las props
import PropTypes from 'prop-types';
// Importa el componente Modal de la librería react-modal
import Modal from 'react-modal';

// Define el componente funcional DetallesModal que recibe tres props: isOpen, onRequestClose y actividad
const DetallesModal = ({ isOpen, onRequestClose, actividad }) => {
  return (
    // Renderiza el componente Modal con las props correspondientes
    <Modal
      isOpen={isOpen} // Controla si el modal está abierto o cerrado
      onRequestClose={onRequestClose} // Función que se llama para cerrar el modal
      contentLabel="Detalles de la Actividad" // Etiqueta accesible para el contenido del modal
      className="flex w-100 items-center justify-center" // Clases CSS para el estilo del modal
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" // Clases CSS para el estilo del overlay
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full"> {/* Contenedor principal del contenido del modal */}
        {actividad ? ( // Verifica si hay datos de actividad disponibles
          <>
            <div className="text-center"> {/* Contenedor para centrar el texto */}
              <h2 className="font-bold text-white text-3xl mb-4">Detalles de la Actividad</h2> {/* Título del modal */}
              <p className="font-bold text-lg my-2"><strong>Fecha:</strong> {actividad.fecha}</p> {/* Muestra la fecha de la actividad */}
              <p className="font-bold text-lg my-2"><strong>Hora de Inicio:</strong> {actividad.horaInicio}</p> {/* Muestra la hora de inicio */}
              <p className="font-bold text-lg my-2"><strong>Hora de Final:</strong> {actividad.horaFinal}</p> {/* Muestra la hora de finalización */}
              <p className="font-bold text-lg my-2"><strong>Interrupción:</strong> {actividad.interrupcion} segundos</p> {/* Muestra la duración de la interrupción */}
              <p className="font-bold text-lg my-2"><strong>Tiempo:</strong> {actividad.minutos} minutos</p> {/* Muestra el tiempo total en minutos */}
              <p className="font-bold text-lg my-2"><strong>Nombre de la Actividad:</strong> {actividad.actividad}</p> {/* Muestra el nombre de la actividad */}
              <p className="font-bold text-lg my-2"><strong>Comentarios:</strong> {actividad.comentarios}</p> {/* Muestra los comentarios */}
              <p className="font-bold text-lg my-2"><strong>Completada:</strong> {actividad.completada ? 'Sí' : 'No'}</p> {/* Indica si la actividad está completada */}
              <p className="font-bold text-lg my-2"><strong>Unidades:</strong> {actividad.unidades}</p> {/* Muestra las unidades */}
            </div>
          </>
        ) : ( // Si no hay datos de actividad disponibles
          <p className="font-bold text-lg my-4">No hay detalles disponibles.</p> // Muestra un mensaje indicando que no hay detalles disponibles
        )}
        <button
          className="mt-4 rounded border bg-transparent cursor-pointer font-semibold text-white hover:scale-110 hover:text-black hover:bg-white px-4 py-2" // Clases CSS para el estilo del botón
          onClick={onRequestClose} // Llama a la función para cerrar el modal cuando se hace clic en el botón
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

// Define los tipos de las props que recibe el componente
DetallesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen debe ser un booleano y es requerido
  onRequestClose: PropTypes.func.isRequired, // onRequestClose debe ser una función y es requerido
  actividad: PropTypes.object, // actividad debe ser un objeto, pero no es requerido
};

// Exporta el componente DetallesModal para que pueda ser usado en otros archivos
export default DetallesModal;