/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import NavBar from '../Navbar/Navbar';
import RelojFigura from '../RelojFigura/RelojFigura';
import axios from 'axios';
import ProjectChart from '../ProjectChart/ProjectChart'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEnvelope, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Función para obtener los proyectos y sus actividades
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/proyectos'); // Ajusta la URL según tu API
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]); // Asegurarse de que projects sea un array en caso de error
            }
        };

        fetchProjects();
    }, []);

    const irAProyectos = () => {
        window.location.href = '/proyectos';
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full">
                <NavBar />
            </div>
            <div className="flex-grow container mx-auto p-6">
                <h1 className="text-4xl font-bold text-center my-8">¡Hola!</h1>
                <p className="text-xl text-center mb-30">Bienvenido a la página de gestión de proyectos con reloj checador.</p>
                <div className="flex flex-col items-center justify-center">
                    <RelojFigura />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-40">
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
                        {Array.isArray(projects) && projects.map((project) => (
                            <div key={project.id} className="mb-8">
                                <h2 className="text-2xl font-bold text-center">{project.name}</h2>
                                <ProjectChart activities={project.activities} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;