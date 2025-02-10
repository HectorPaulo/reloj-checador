/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import AlertaError from '../Alerta/Error/AlertaError';
import AlertaExito from '../Alerta/Exito/AlertaExito';
import AlertaAdvertencia from '../Alerta/Advertencia/AlertaAdvertencia';
import Loader from '../Loader/Loader';
import GoogleIcon from '@mui/icons-material/Google';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setWarning('Por favor, complete todos los campos.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setWarning('Por favor, ingrese un correo electrónico válido.');
      return;
    }
    setIsLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Usuario registrado exitosamente. Bienvenido!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Credenciales aceptadas. Bienvenido!');
      }
      onLogin();
    } catch (error) {
      if (error.code === 'authemail-already-in-use') {
        setError('El correo electrónico ya está registrado.');
      } else {
        setError('Error en la autenticación. Por favor, intente de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess('Inicio de sesión con Google exitoso. Bienvenido!');
      onLogin();
    } catch (error) {
      setError('Error en la autenticación con Google. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleCloseSuccess = () => {
    setSuccess('');
  };

  const handleCloseWarning = () => {
    setWarning('');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
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
  onLogin: PropTypes.func.isRequired,
};

export default Login;