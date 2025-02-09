import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const NavBar = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión: ', error);
        }
    };

    return (
        <nav className='bg-transparent mr-4 p-6'>
            <ul className='flex justify-end gap-3'>
                <li>
                    <Link to={'/'} className='font-semibold text-xl text-white hover:text-gray-400'>
                        Reloj
                    </Link>
                </li>
                <li>
                    <Link to='/about' className='font-semibold text-xl text-white hover:text-gray-400'>
                        Acerca
                    </Link>
                </li>
                <li>
                    <Link to='/contacto' className='font-semibold text-xl text-white hover:text-gray-400'>
                        Contacto
                    </Link>
                </li>
                <li>
                    <Link to='/ListaActividades' className='font-semibold text-xl text-white hover:text-gray-400'>
                        Lista de Actividades
                    </Link>
                </li>
                <li>
                    <button className='font-semibold text-lg text-white hover:text-gray-400 cursor-pointer hover:scale-105' onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;