/* eslint-disable no-unused-vars */ // Desactiva la regla de ESLint que marca las variables no utilizadas como error.
import React from 'react'; // Importa la biblioteca React.
import NavBar from '../Navbar/Navbar'; // Importa el componente NavBar.
import Footer from '../Footer/Footer'; // Importa el componente Footer.

/**
 * Componente About que proporciona información sobre el proyecto.
 * 
 * Este componente incluye:
 * - Un componente NavBar en la parte superior.
 * - Varias secciones con texto e imágenes que describen el proyecto.
 * - Un componente Footer en la parte inferior.
 * 
 * El contenido está estructurado usando flexbox para diseño responsivo.
 * 
 * @component
 * @example
 * return (
 *   <About />
 * )
 */
const About = () => {
    return (
        <div> {/* Contenedor principal del componente About */}
            <NavBar/> {/* Componente de navegación en la parte superior */}
            <div className="flex flex-col items-center p-6 min-h-screen"> {/* Contenedor con flexbox para diseño responsivo */}
                <h1 className="text-4xl lg:text-8xl my-5 font-bold mb-15">Acerca del Proyecto</h1> {/* Título principal */}
                <div className="flex flex-col lg:flex-row items-center mb-4 max-w-4xl"> {/* Sección con texto e imagen */}
                    <p className="text-lg text-center lg:text-left">
                        La gestión del tiempo es crucial para el éxito de cualquier proyecto, ya que permite una mejor planificación y ejecución de las tareas; un equipo de trabajo que desarrolla un proyecto sin tomar en cuenta  el tiempo que le tomará realizar cada tarea está cayendo en malas prácticas y puede ser desastroso para el proyecto.
                    </p> {/* Párrafo descriptivo */}
                    <img src="/public/undraw_hello_ccwj.svg" alt="Descripción del proyecto" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4"/> {/* Imagen descriptiva */}
                </div>
                <div className="flex flex-col lg:flex-row items-center mb-4 max-w-4xl"> {/* Sección con imagen y texto */}
                    <img src="/public/undraw_prioritise_f8db.svg" alt="Descripción del proyecto" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4"/> {/* Imagen descriptiva */}
                    <p className="text-lg text-center lg:text-left">
                        Este proyecto es una aplicación de reloj checador que permite a los usuarios registrar y gestionar sus actividades diarias. 
                        La aplicación está diseñada para ser fácil de usar y proporciona una interfaz intuitiva para iniciar, detener y editar actividades.
                    </p> {/* Párrafo descriptivo */}
                </div>
                <div className="flex flex-col lg:flex-row-reverse items-center mb-4 max-w-4xl"> {/* Sección con imagen y texto en orden inverso */}
                    <img src="/public/undraw_dev-productivity_5wps.svg" alt="Gráficos interactivos" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:ml-4"/> {/* Imagen descriptiva */}
                    <p className="text-lg text-center lg:text-left">
                        Con esta herramienta, los usuarios pueden visualizar el tiempo dedicado a cada actividad a través de gráficos interactivos, 
                        lo que les permite analizar y optimizar su productividad. La aplicación utiliza Firebase para almacenar los datos de las actividades 
                        y React para la interfaz de usuario.
                    </p> {/* Párrafo descriptivo */}
                </div>
                <div className="flex flex-col lg:flex-row items-center mb-4 max-w-4xl"> {/* Sección con imagen y texto */}
                    <img src="/public/undraw_data-trends_kv5v.svg" alt="Mejora de productividad" className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-4"/> {/* Imagen descriptiva */}
                    <p className="text-lg text-center lg:text-left">
                        Esperamos que esta aplicación sea útil para aquellos que buscan una manera eficiente de gestionar su tiempo y mejorar su productividad diaria.
                    </p> {/* Párrafo descriptivo */}
                </div>
            </div>
            <Footer /> {/* Componente de pie de página */}
        </div>
    );
};

export default About; // Exporta el componente About como el valor predeterminado del módulo.