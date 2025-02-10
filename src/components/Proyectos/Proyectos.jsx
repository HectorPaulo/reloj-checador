/* eslint-disable no-unused-vars */
// Importing necessary libraries and components
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// Component definition
const Proyectos = ({ onSelectProject }) => {
  // State variables
  const [proyectos, setProyectos] = useState([]); // Stores the list of projects
  const [actividades, setActividades] = useState({}); // Stores activities for each project
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [inputValue, setInputValue] = useState(''); // Input value for new project

  // Fetch projects and activities on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = auth.currentUser; // Get current user
        if (user) {
          const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Query for user's projects
          const querySnapshot = await getDocs(projectsQuery); // Fetch projects
          const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map projects data
          setProyectos(proyectosData); // Set projects state

          // Fetch activities for each project
          const actividadesData = {};
          for (const project of proyectosData) {
            const actividadesQuery = query(
              collection(db, 'usuarios', user.uid, 'proyectos', project.id, 'actividades')
            );
            const actividadesSnapshot = await getDocs(actividadesQuery); // Fetch activities
            actividadesData[project.id] = actividadesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map activities data
          }
          setActividades(actividadesData); // Set activities state
        }
      } catch (error) {
        console.error('Error al buscar los proyectos: ', error); // Log error
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };
    fetchProjects(); // Call fetchProjects function
  }, []);

  // Function to add a new project
  const handleAddProject = useCallback(async () => {
    if (inputValue.trim() === '') {
      return; // Do nothing if input is empty
    }
    try {
      const user = auth.currentUser; // Get current user
      if (user) {
        await addDoc(collection(db, 'usuarios', user.uid, 'proyectos'), {
          nombre: inputValue, // Add new project with input value
        });
        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Query for user's projects
        const querySnapshot = await getDocs(projectsQuery); // Fetch projects
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map projects data
        setProyectos(proyectosData); // Set projects state
        setInputValue(''); // Clear input value
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el proyecto: ', e); // Log error
    }
  }, [inputValue]);

  // Function to delete a project
  const handleDeleteProject = useCallback(async (id) => {
    try {
      const user = auth.currentUser; // Get current user
      if (user) {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', id)); // Delete project by id
        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Query for user's projects
        const querySnapshot = await getDocs(projectsQuery); // Fetch projects
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map projects data
        setProyectos(proyectosData); // Set projects state
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el proyecto: ', e); // Log error
    }
  }, []);

  // Memoized calculation of aggregated activities
  const actividadesAgregadas = useMemo(() => {
    const agregado = {};
    for (const projectId in actividades) {
      agregado[projectId] = actividades[projectId].reduce((acc, curr) => {
        const llave = curr.actividad; // Activity key
        if (!acc[llave]) {
          acc[llave] = 0; // Initialize if not present
        }
        acc[llave] += curr.minutos; // Sum minutes
        return acc;
      }, {});
    }
    return agregado;
  }, [actividades]);

  // Memoized data for chart
  const agregadoData = useMemo(() => {
    const data = {};
    for (const projectId in actividadesAgregadas) {
      data[projectId] = {
        labels: Object.keys(actividadesAgregadas[projectId]), // Activity labels
        datasets: [
          {
            label: 'Minutos por actividad', // Dataset label
            data: Object.values(actividadesAgregadas[projectId]), // Activity data
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
          },
        ],
      };
    }
    return data;
  }, [actividadesAgregadas]);

  // Render loader if data is still loading
  if (isLoading) {
    return <Loader />;
  }

  // Render component
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
        {proyectos.map((project) => (
          <div key={project.id} className='w-full max-w-2xl mx-auto mt-8'>
            <h2 className="text-2xl font-bold text-center">Gráfica de Actividades - {project.nombre}</h2>
            <Bar data={agregadoData[project.id]} />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

// PropTypes validation
Proyectos.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default Proyectos;