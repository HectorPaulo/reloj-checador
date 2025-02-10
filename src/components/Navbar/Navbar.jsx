import { Link, useNavigate } from 'react-router-dom'; // Importa Link y useNavigate de react-router-dom para la navegación
import { getAuth, signOut } from 'firebase/auth'; // Importa getAuth y signOut de firebase/auth para la autenticación
import { useState, useEffect } from 'react'; // Importa useState y useEffect de React para manejar el estado y efectos secundarios

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado para manejar si el menú está abierto o cerrado
    const [dateTime, setDateTime] = useState(new Date()); // Estado para manejar la fecha y hora actual
    const navigate = useNavigate(); // Hook para la navegación
    const auth = getAuth(); // Obtiene la instancia de autenticación de Firebase

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date()); // Actualiza la fecha y hora cada segundo
        }, 1000);

        return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonta
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Cierra sesión en Firebase
            navigate('/login'); // Navega a la página de login
        } catch (error) {
            console.error('Error al cerrar sesión: ', error); // Muestra un error en la consola si falla el cierre de sesión
        }
    };

    return (
        <nav className='bg-transparent p-6'> {/* Contenedor del navbar con estilos */}
            <div className='flex justify-between items-center'> {/* Contenedor flex para alinear elementos */}
                <div className='font-semibold text-xl text-white'> {/* Contenedor para mostrar la fecha y hora */}
                    <p>Hoy es</p>{dateTime.toLocaleDateString()} a las {dateTime.toLocaleTimeString()} {/* Muestra la fecha y hora actual */}
                </div>
                <div className='md:hidden'> {/* Botón para abrir/cerrar el menú en dispositivos móviles */}
                    <button onClick={() => setIsOpen(!isOpen)} className='text-white focus:outline-none'> {/* Cambia el estado isOpen al hacer clic */}
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'> {/* Icono del botón */}
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path> {/* Cambia el icono según el estado isOpen */}
                        </svg>
                    </button>
                </div>
                <div className={`w-full md:flex md:justify-end ${isOpen ? 'block' : 'hidden'} md:block`}> {/* Contenedor del menú, visible según el estado isOpen */}
                    <ul className='md:flex md:items-center md:gap-6'> {/* Lista de enlaces del menú */}
                        <li>
                            <Link to='/' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'> {/* Enlace al Dashboard */}
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to='/about' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'> {/* Enlace a Acerca */}
                                Acerca
                            </Link>
                        </li>
                        <li>
                            <Link to='/contacto' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'> {/* Enlace a Contacto */}
                                Contacto
                            </Link>
                        </li>
                        <li>
                            <Link to='/Proyectos' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'> {/* Enlace a Proyectos */}
                                Proyectos
                            </Link>
                        </li>
                        <li>
                            <button className='mt-4 md:flex md:mt-0 font-semibold text-lg text-white hover:text-gray-400 cursor-pointer hover:scale-105 flex items-center' onClick={handleLogout}> {/* Botón para cerrar sesión */}
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="red"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg> {/* Icono del botón */}
                                <span className="position-relative mx-2 text-red-500">Cerrar Sesión</span> {/* Texto del botón */}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar; // Exporta el componente NavBar