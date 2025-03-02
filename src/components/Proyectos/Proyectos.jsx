/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { addActividad } from '../../controllers/controller';
import { generarPDF } from '../../utils/GeneradorPdf';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ConfirmarBorrar from '../Modales/Borrar/BorrarModal';
import DetallesProyectoModal from '../Modales/DetallesProyecto/DetallesProyecto';
import Loader from '../Loader/Loader';

const Proyectos = ({ onSelectProject }) => {
  const [inputValue, setInputValue] = useState('');
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Cambiar el estado inicial a true
  const [borrarId, setBorrarId] = useState(null);
  const [borrarModalIsOpen, setBorrarModalIsOpen] = useState(false);
  const [detallesProyectoModalIsOpen, setDetallesProyectoModalIsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos');
          const querySnapshot = await getDocs(projectsQuery);
          const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProyectos(proyectosData);
        }
      } catch (error) {
        console.error('Error al buscar los proyectos: ', error);
      } finally {
        setIsLoading(false); // Cambiar el estado a false después de obtener los datos
      }
    };
    fetchProyectos();
  }, []);

  const handleAddProject = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, 'usuarios', user.uid, 'proyectos'), {
          nombre: inputValue,
          fechaCreacion: new Date().toISOString()
        });

        const actividades = [
          'Planificación',
          'Análisis',
          'Codificación',
          'Pruebas',
          'Lanzamiento',
          'Revision',
          'RevisionCodigo',
          'Diagramar',
          'Reunion'
        ];

        for (const actividad of actividades) {
          await addActividad(docRef.id, {
            actividad,
            minutos: 0,
            fecha: '',
            horaInicio: '',
            horaFinal: '',
            interrupcion: 0,
            comentarios: ''
          });
        }

        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos');
        const querySnapshot = await getDocs(projectsQuery);
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProyectos(proyectosData);
        setInputValue('');
        onSelectProject(docRef.id);
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el proyecto: ', e);
    }
  }, [inputValue, onSelectProject]);

  const handleDeleteProject = useCallback(async (id) => {
    try {
      setBorrarId(id);
      setBorrarModalIsOpen(true);
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el proyecto: ', e);
    }
  }, []);

  const handleDetallesProyecto = useCallback((projectId) => {
    setSelectedProjectId(projectId);
    setDetallesProyectoModalIsOpen(true);
  }, []);

  const handleDownload = useCallback(async (projectId) => {
    await generarPDF(projectId);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex-grow'>
        <h1 className='font-bold text-4xl sm:text-6xl font-sans text-center my-6 sm:my-12'>Proyectos</h1>
        <div className='w-full max-w-2xl mx-auto'>
          <ul className='p-10 w-full mt-4'>
            {proyectos.map((project) => (
              <li key={project.id} className='flex justify-between items-center border-b cursor-pointer hover:bg-gray-700'>
                <div onClick={() => onSelectProject(project.id)} className='p-2 w-full h-full'>
                  <span>{project.nombre}</span>
                </div>
                <div className='flex items-center'>
                  <button
                    className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                    onClick={() => handleDownload(project.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="yellow"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                  </button>
                  <button
                    className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                    onClick={() => handleDetallesProyecto(project.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                  </button>
                  <button
                    className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4 className='font-semibold text-xl my-4'>Nuevo proyecto</h4>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg disabled:bg-white disabled:text-black bg-transparent text-white"
            placeholder="Nombre del proyecto"
          />
          <div className="flex justify-center">
            <button 
              onClick={async () => {
                setIsLoading(true);
                await handleAddProject();
                setIsLoading(false);
              }} 
              className="w-50 px-6 py-3 my-4 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110 disabled:text-black disabled:bg-gray-700" 
              disabled={!inputValue.trim()}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
      <ConfirmarBorrar
        id={borrarId}
        setBorrarModal={setBorrarModalIsOpen}
        setBorrarId={setBorrarId}
      />
      <DetallesProyectoModal
        isOpen={detallesProyectoModalIsOpen}
        onRequestClose={() => setDetallesProyectoModalIsOpen(false)}
        projectId={selectedProjectId}
      />
      <Footer />
    </div>
  );
};

Proyectos.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default Proyectos;