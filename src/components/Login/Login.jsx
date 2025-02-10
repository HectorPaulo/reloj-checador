/* eslint-disable no-unused-vars */
import React, { useState } from 'react'; // Importa React y el hook useState
import PropTypes from 'prop-types'; // Importa PropTypes para la validación de tipos
import { auth, googleProvider } from '../../firebaseConfig'; // Importa la configuración de Firebase
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Importa funciones de autenticación de Firebase
import AlertaError from '../Alerta/Error/AlertaError'; // Importa el componente de alerta de error
import AlertaExito from '../Alerta/Exito/AlertaExito'; // Importa el componente de alerta de éxito
import AlertaAdvertencia from '../Alerta/Advertencia/AlertaAdvertencia'; // Importa el componente de alerta de advertencia
import Loader from '../Loader/Loader'; // Importa el componente de cargador
import GoogleIcon from '@mui/icons-material/Google'; // Importa el icono de Google

const Login = ({ onLogin }) => { // Define el componente Login que recibe la función onLogin como prop
  const [email, setEmail] = useState(''); // Estado para el correo electrónico
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre registro e inicio de sesión
  const [error, setError] = useState(''); // Estado para manejar errores
  const [success, setSuccess] = useState(''); // Estado para manejar mensajes de éxito
  const [warning, setWarning] = useState(''); // Estado para manejar advertencias
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el estado de carga

  const handleSubmit = async (e) => { // Función para manejar el envío del formulario
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    if (!email || !password) { // Verifica si los campos de correo y contraseña están vacíos
      setWarning('Por favor, complete todos los campos.'); // Establece una advertencia si los campos están vacíos
      return; // Sale de la función si hay campos vacíos
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el correo electrónico
    if (!emailRegex.test(email)) { // Verifica si el correo electrónico es válido
      setWarning('Por favor, ingrese un correo electrónico válido.'); // Establece una advertencia si el correo no es válido
      return; // Sale de la función si el correo no es válido
    }
    setIsLoading(true); // Establece el estado de carga a verdadero
    try {
      if (isRegister) { // Verifica si el usuario está registrándose
        await createUserWithEmailAndPassword(auth, email, password); // Crea un nuevo usuario con correo y contraseña
        setSuccess('Usuario registrado exitosamente. Bienvenido!'); // Establece un mensaje de éxito
      } else {
        await signInWithEmailAndPassword(auth, email, password); // Inicia sesión con correo y contraseña
        setSuccess('Credenciales aceptadas. Bienvenido!'); // Establece un mensaje de éxito
      }
      onLogin(); // Llama a la función onLogin
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') { // Verifica si el correo ya está en uso
        setError('El correo electrónico ya está registrado.'); // Establece un mensaje de error
      } else {
        setError('Error en la autenticación. Por favor, intente de nuevo.'); // Establece un mensaje de error genérico
      }
    } finally {
      setIsLoading(false); // Establece el estado de carga a falso
    }
  };

  const handleGoogleSignIn = async () => { // Función para manejar el inicio de sesión con Google
    setIsLoading(true); // Establece el estado de carga a verdadero
    try {
      await signInWithPopup(auth, googleProvider); // Inicia sesión con Google
      setSuccess('Inicio de sesión con Google exitoso. Bienvenido!'); // Establece un mensaje de éxito
      onLogin(); // Llama a la función onLogin
    } catch (error) {
      setError('Error en la autenticación con Google. Por favor, intente de nuevo.'); // Establece un mensaje de error
    } finally {
      setIsLoading(false); // Establece el estado de carga a falso
    }
  };

  const handleCloseError = () => { // Función para cerrar el mensaje de error
    setError(''); // Limpia el mensaje de error
  };

  const handleCloseSuccess = () => { // Función para cerrar el mensaje de éxito
    setSuccess(''); // Limpia el mensaje de éxito
  };

  const handleCloseWarning = () => { // Función para cerrar el mensaje de advertencia
    setWarning(''); // Limpia el mensaje de advertencia
  };

  if (isLoading) { // Verifica si está en estado de carga
    return <Loader />; // Muestra el componente de cargador
  }

  return ( // Retorna el JSX del componente
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-0" onClick={handleCloseWarning}>
      <h1 className="text-4xl mb-10 lg:text-5xl text-center font-bold ">{isRegister ? 'Registro' : 'Inicio de sesión'}</h1>
      <form onSubmit={handleSubmit} className="bg-transparent p-6 rounded-xl border w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className={isRegister ? 'mb-4' : 'mb-8 mt-4'}>
          <label className="block text-white font-semibold mb-2">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className={isRegister ? 'mb-4' : 'mb-8'}>
          <label className="block text-white font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        {isRegister && (
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2">Confirmar contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 mt-1"
              required
            />
          </div>
        )}
        {error && <AlertaError mensaje={error} onClose={handleCloseError} />}
        {success && <AlertaExito mensaje={success} onClose={handleCloseSuccess} />}
        {warning && <AlertaAdvertencia mensaje={warning} onClose={handleCloseWarning} />}
        <div className="flex justify-center">
          <button type="submit" className="w-full bg-transparent border text-white p-2 rounded cursor-pointer hover:bg-amber-50 hover:text-black">
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <button type="button" onClick={handleGoogleSignIn} className="w-full bg-transparent border text-white p-2 rounded cursor-pointer hover:bg-amber-50 hover:text-black">
            <GoogleIcon />
          </button>
        </div>
        <p className="mt-4 text-center">
          {isRegister ? '¿Ya tienes una cuenta?' : "¿No tienes cuenta aún?"}{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </span>
        </p>
      </form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired, // Define la prop onLogin como requerida y de tipo función
};

export default Login; // Exporta el componente Login