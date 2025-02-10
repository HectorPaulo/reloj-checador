/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import ProjectChart from '../ProjectChart/ProjectChart';

const Proyectos = ({ onSelectProject }) => {
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
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
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = useCallback(async () => {
    if (inputValue.trim() === '') {
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'usuarios', user.uid, 'proyectos'), {
          nombre: inputValue,
        });
        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos');
        const querySnapshot = await getDocs(projectsQuery);
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProyectos(proyectosData);
        setInputValue('');
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el proyecto: ', e);
    }
  }, [inputValue]);

  const handleDeleteProject = useCallback(async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', id));
        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos');
        const querySnapshot = await getDocs(projectsQuery);
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProyectos(proyectosData);
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el proyecto: ', e);
    }
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
              <li key={project.id} className='flex justify-between items-center p-2 border-b'>
                <span>{project.nombre}</span>
                <div>
                  <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => onSelectProject(project.id)}>Seleccionar</button>
                  <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDeleteProject(project.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
          <h4 className='font-semibold text-xl my-4'>Nuevo proyecto</h4>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black"
            placeholder="Nombre del proyecto"
          />
          <div className="flex justify-center">
            <button onClick={handleAddProject} className="w-50 px-6 py-3 my-4 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110">Agregar</button>
          </div>
        </div>
        <div className='w-full max-w-2xl mx-auto mt-8'>
          {proyectos.map((project) => (
            <div key={project.id} className="mb-8">
              <h2 className="text-2xl font-bold text-center">{project.nombre}</h2>
              <ProjectChart activities={project.actividades || []} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

Proyectos.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default Proyectos;