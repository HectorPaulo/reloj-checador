import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión: ', error);
        }
    };

    return (
        <nav className='bg-transparent p-6'>
            <div className='flex justify-between items-center'>
                <div className='font-semibold text-xl text-white'>
                    <p>Hoy es</p>{dateTime.toLocaleDateString()} a las {dateTime.toLocaleTimeString()}
                </div>
                <div className='md:hidden'>
                    <button onClick={() => setIsOpen(!isOpen)} className='text-white focus:outline-none'>
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
                        </svg>
                    </button>
                </div>
                <div className={`w-full md:flex md:justify-end ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <ul className='md:flex md:items-center md:gap-6'>
                        <li>
                            <Link to='/' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to='/about' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'>
                                Acerca
                            </Link>
                        </li>
                        <li>
                            <Link to='/contacto' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'>
                                Contacto
                            </Link>
                        </li>
                        <li>
                            <Link to='/Proyectos' className='block mt-4 md:inline-block md:mt-0 font-semibold text-xl text-white hover:scale-110 hover:text-gray-500'>
                                Proyectos
                            </Link>
                        </li>
                        <li>
                            <button className='mt-4 md:flex md:mt-0 font-semibold text-lg text-white hover:text-gray-400 cursor-pointer hover:scale-105 flex items-center' onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="red"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                                <span className="position-relative mx-2 text-red-500">Cerrar Sesión</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;