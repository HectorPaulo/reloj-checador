/* eslint-disable no-unused-vars */
import React from 'react';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const About = () => {
    return (
        <div>
            <NavBar/>
        <div className="flex flex-col items-center p-6 min-h-screen">
            <h1 className="text-4xl lg:text-8xl my-5 font-bold mb-4">Acerca del Proyecto</h1>
            <p className="text-lg mb-4 text-center max-w-2xl">
                Este proyecto es una aplicación de reloj checador que permite a los usuarios registrar y gestionar sus actividades diarias. 
                La aplicación está diseñada para ser fácil de usar y proporciona una interfaz intuitiva para iniciar, detener y editar actividades.
            </p>
            <p className="text-lg mb-4 text-center max-w-2xl">
                Con esta herramienta, los usuarios pueden visualizar el tiempo dedicado a cada actividad a través de gráficos interactivos, 
                lo que les permite analizar y optimizar su productividad. La aplicación utiliza Firebase para almacenar los datos de las actividades 
                y React para la interfaz de usuario.
            </p>
            <p className="text-lg mb-4 text-center max-w-2xl">
                Esperamos que esta aplicación sea útil para aquellos que buscan una manera eficiente de gestionar su tiempo y mejorar su productividad diaria.
            </p>
        </div>
        <Footer />
        </div>
    );
};

export default About;