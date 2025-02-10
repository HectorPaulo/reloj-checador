/* eslint-disable no-unused-vars */
// Importa las dependencias necesarias de React y otros módulos
import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import NavBar from '../Navbar/Navbar';
import RelojFigura from '../RelojFigura/RelojFigura';
import axios from 'axios';
import ProjectChart from '../ProjectChart/ProjectChart'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEnvelope, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

// Define el componente Dashboard
const Dashboard = () => {
    // Define el estado 'projects' y su función para actualizarlo 'setProjects'
    const [projects, setProjects] = useState([]);

    // useEffect para ejecutar código después de que el componente se monte
    useEffect(() => {
        // Función asíncrona para obtener los proyectos desde la API
        const fetchProjects = async () => {
            try {
                // Realiza una solicitud GET a la API para obtener los proyectos
                const response = await axios.get('/api/proyectos'); 
                // Actualiza el estado 'projects' con los datos obtenidos
                setProjects(response.data);
            } catch (error) {
                // Maneja cualquier error que ocurra durante la solicitud
                console.error('Error fetching projects:', error);
                // En caso de error, establece 'projects' como un array vacío
                setProjects([]); 
            }
        };

        // Llama a la función para obtener los proyectos
        fetchProjects();
    }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

    // Función para redirigir a la página de proyectos
    const irAProyectos = () => {
        window.location.href = '/proyectos';
    };

    // Renderiza el componente
    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full">
                <NavBar /> {/* Renderiza el componente NavBar */}
            </div>
            <div className="flex-grow container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center my-8">¡Hola!</h1>
                <p className="text-xl text-center mb-30">Bienvenido a la página de gestión de proyectos con reloj checador.</p>
                <div className="flex flex-col items-center justify-center">
                    <RelojFigura /> {/* Renderiza el componente RelojFigura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-40">
                        {/* Enlaces a diferentes páginas con íconos */}
                        <Link to="/about" className="card">
                            <div className="p-6 border rounded-lg hover:scale-110 hover:bg-white hover:text-black shadow hover:shadow-lg transition">
                                <h2 className="text-2xl font-bold text-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                    Acerca
                                </h2>
                            </div>
                        </Link>
                        <Link to="/contacto" className="card">
                            <div className="p-6 border rounded-lg hover:scale-110 hover:bg-white hover:text-black shadow hover:shadow-lg transition">
                                <h2 className="text-2xl font-bold text-center">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                    Contacto
                                </h2>
                            </div>
                        </Link>
                        <Link to="/proyectos" className="card">
                            <div className="p-6 border rounded-lg hover:scale-110 hover:bg-white hover:text-black shadow hover:shadow-lg transition">
                                <h2 className="text-2xl font-bold text-center">
                                    <FontAwesomeIcon icon={faProjectDiagram} className="mr-2" />
                                    Proyectos
                                </h2>
                            </div>
                        </Link>
                    </div>
                    <div className="mt-10 w-full">
                        {/* Mapea sobre los proyectos y renderiza un ProjectChart para cada uno */}
                        {Array.isArray(projects) && projects.map((project) => (
                            <div key={project.id} className="mb-8">
                                <h2 className="text-2xl font-bold text-center">{project.name}</h2>
                                <ProjectChart activities={project.activities} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer /> {/* Renderiza el componente Footer */}
        </div>
    );
};

// Exporta el componente Dashboard como el valor por defecto del módulo
export default Dashboard;