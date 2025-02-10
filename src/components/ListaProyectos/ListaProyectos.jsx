/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'; // Import React and necessary hooks
import { db, auth } from '../../firebaseConfig'; // Import Firebase configuration
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import NavBar from '../Navbar/Navbar'; // Import NavBar component
import Footer from '../Footer/Footer'; // Import Footer component
import Loader from '../Loader/Loader'; // Import Loader component
import PropTypes from 'prop-types'; // Import PropTypes for type checking

const ListaProyectos = ({ onSelectProject = () => {} }) => { // Define ListaProyectos component with onSelectProject prop
  const [proyectos, setProyectos] = useState([]); // State to store projects
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [inputValue, setInputValue] = useState(''); // State to manage input value

  useEffect(() => { // useEffect to fetch projects on component mount
    const fetchproyectos = async () => { // Async function to fetch projects
      try {
        const user = auth.currentUser; // Get current user
        if (user) {
          const proyectosQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Reference to user's projects collection
          const querySnapshot = await getDocs(proyectosQuery); // Fetch documents from Firestore
          const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to project data
          setProyectos(proyectosData); // Set projects state
        }
      } catch (error) {
        console.error('Error al buscar los proyectos: ', error); // Log error if fetching fails
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };
    fetchproyectos(); // Call fetchproyectos function
  }, []); // Empty dependency array to run only once

  const handleAddProject = useCallback(async () => { // useCallback to memoize handleAddProject function
    if (inputValue.trim() === '') { // Check if input value is empty
      return; // Return if input is empty
    }
    try {
      const user = auth.currentUser; // Get current user
      if (user) {
        await addDoc(collection(db, 'usuarios', user.uid, 'proyectos'), { // Add new project to Firestore
          nombre: inputValue, // Project name from input value
        });
        const proyectosQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Reference to user's projects collection
        const querySnapshot = await getDocs(proyectosQuery); // Fetch updated documents from Firestore
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to project data
        setProyectos(proyectosData); // Set projects state
        setInputValue(''); // Clear input value
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el proyecto: ', e); // Log error if adding project fails
    }
  }, [inputValue]); // Dependency array with inputValue

  const handleDeleteProject = useCallback(async (id) => { // useCallback to memoize handleDeleteProject function
    try {
      const user = auth.currentUser; // Get current user
      if (user) {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', id)); // Delete project from Firestore
        const proyectosQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Reference to user's projects collection
        const querySnapshot = await getDocs(proyectosQuery); // Fetch updated documents from Firestore
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map documents to project data
        setProyectos(proyectosData); // Set projects state
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el proyecto: ', e); // Log error if deleting project fails
    }
  }, []); // Empty dependency array

  if (isLoading) { // Check if loading
    return <Loader />; // Render Loader component if loading
  }

  return ( // Render component
    <div className='flex flex-col items-center min-h-screen'> {/* Container div with flex and center alignment */}
      <div className='w-full'> {/* Full width div for NavBar */}
        <NavBar /> {/* Render NavBar component */}
      </div>
      <h1 className='font-bold text-4xl sm:text-6xl font-sans text-center my-6 sm:my-12'>Proyectos</h1> {/* Heading */}
      <div className='w-full max-w-2xl mx-auto'> {/* Container div for input and project list */}
        <input
          type="text"
          value={inputValue} // Bind input value to state
          onChange={(e) => setInputValue(e.target.value)} // Update state on input change
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white text-black" // Input styling
          placeholder="Nombre del proyecto" // Input placeholder
        />
        <button onClick={handleAddProject} className="px-6 py-2 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110">Agregar Proyecto</button> {/* Button to add project */}
        <ul className='w-full mt-4'> {/* Unordered list for projects */}
          {proyectos.map((project) => ( // Map over projects
            <li key={project.id} className='flex justify-between items-center p-2 border-b'> {/* List item for each project */}
              <span>{project.nombre}</span> {/* Project name */}
              <div> {/* Container for buttons */}
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => onSelectProject(project.id)}>Seleccionar</button> {/* Button to select project */}
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDeleteProject(project.id)}>Eliminar</button> {/* Button to delete project */}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer /> {/* Render Footer component */}
    </div>
  );
};

ListaProyectos.propTypes = { // Define prop types
  onSelectProject: PropTypes.func.isRequired, // onSelectProject is a required function
};

export default ListaProyectos; // Export ListaProyectos component