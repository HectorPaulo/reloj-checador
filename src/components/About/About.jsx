/* eslint-disable no-unused-vars */
import React from 'react';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const About = () => {
    return (
        <div>
            <NavBar/>
            <div className="flex flex-col items-center p-6 min-h-screen">
                <h1 className="text-4xl lg:text-8xl my-5 font-bold mb-15">Acerca del Proyecto</h1>
                <div className="flex flex-col lg:flex-row items-center mb-4 max-w-4xl">
                    <p className="text-lg text-center lg:text-left">
                        La gestión del tiempo es crucial para el éxito de cualquier proyecto, ya que permite una mejor planificación y ejecución de las tareas; un equipo de trabajo que desarrolla un proyecto sin tomar en cuenta  el tiempo que le tomará realizar cada tarea está cayendo en malas prácticas y puede ser desastroso para el proyecto.
                    </p>
                <img src="/public/undraw_hello_ccwj.svg" alt="Descripción del proyecto" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4"/>
                </div>
                <div className="flex flex-col lg:flex-row items-center mb-4 max-w-4xl">
                    <img src="/public/undraw_prioritise_f8db.svg" alt="Descripción del proyecto" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4"/>
                    <p className="text-lg text-center lg:text-left">
                        Este proyecto es una aplicación de reloj checador que permite a los usuarios registrar y gestionar sus actividades diarias. 
                        La aplicación está diseñada para ser fácil de usar y proporciona una interfaz intuitiva para iniciar, detener y editar actividades.
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row-reverse items-center mb-4 max-w-4xl">
                    <img src="/public/undraw_dev-productivity_5wps.svg" alt="Gráficos interactivos" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:ml-4"/>
                    <p className="text-lg text-center lg:text-left">
                        Con esta herramienta, los usuarios pueden visualizar el tiempo dedicado a cada actividad a través de gráficos interactivos, 
                        lo que les permite analizar y optimizar su productividad. La aplicación utiliza Firebase para almacenar los datos de las actividades 
                        y React para la interfaz de usuario.
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row items-center mb-4 max-w-4xl">
                    <img src="/public/undraw_data-trends_kv5v.svg" alt="Mejora de productividad" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4"/>
                    <p className="text-lg text-center lg:text-left">
                        Esperamos que esta aplicación sea útil para aquellos que buscan una manera eficiente de gestionar su tiempo y mejorar su productividad diaria.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;