import NavBar from '../Navbar/Navbar'; // Importa el componente NavBar desde la ruta especificada
import Footer from '../Footer/Footer'; // Importa el componente Footer desde la ruta especificada

const Contacto = () => { // Define un componente funcional llamado Contacto
    return ( // Retorna el JSX que define la estructura del componente
        <div className="flex flex-col min-h-screen"> {/* Contenedor principal con clases de Tailwind CSS para diseño flexible y altura mínima de pantalla completa */}
            <NavBar /> {/* Renderiza el componente NavBar */}
            <div className="flex-grow container mx-auto p-6"> {/* Contenedor que crece para ocupar el espacio disponible, centrado y con padding */}
                <h1 className="text-4xl font-bold text-center my-8">Contacto</h1> {/* Título principal con clases de Tailwind CSS para estilo */}
                <p className="text-xl text-center mb-8">Puedes ponerte en contacto conmigo a través de los siguientes medios:</p> {/* Párrafo descriptivo con clases de Tailwind CSS para estilo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Contenedor de grid con una columna en pantallas pequeñas y dos en medianas, con espacio entre elementos */}
                    <div className="flex flex-col items-center"> {/* Contenedor flexible con alineación centrada */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"> {/* SVG de un ícono de correo */}
                            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/> {/* Ruta del ícono */}
                        </svg>
                        <p className="text-lg mt-4">014417517@ulsaoaxaca.edu.mx</p> {/* Texto del correo electrónico con clases de Tailwind CSS para estilo */}
                    </div>
                    <div className="flex flex-col items-center"> {/* Contenedor flexible con alineación centrada */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e8eaed"> {/* SVG de un ícono de teléfono */}
                            <path d="M480-80q-150-135-225-230.5T180-480q0-125 87.5-212.5T480-780q125 0 212.5 87.5T780-480q0 75-75 170.5T480-80Zm0-80q100-90 162.5-168.5T705-480q0-93-62.5-155.5T480-698q-93 0-155.5 62.5T262-480q0 52 62.5 130.5T480-160Zm0-240q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Zm0 240Z"/> {/* Ruta del ícono */}
                        </svg>
                        <p className="text-lg mt-4">+52 220 271 4333</p> {/* Texto del número de teléfono con clases de Tailwind CSS para estilo */}
                    </div>
                </div>
            </div>
            <Footer /> {/* Renderiza el componente Footer */}
        </div>
    );
};

export default Contacto; // Exporta el componente Contacto como el valor por defecto del módulo