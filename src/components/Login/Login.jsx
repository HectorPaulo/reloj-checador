/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AlertaError from '../Alerta/Error/AlertaError';
import AlertaExito from '../Alerta/Exito/AlertaExito';
import AlertaAdvertencia from '../Alerta/Advertencia/AlertaAdvertencia';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');

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
      setError('Error en la autenticación. Por favor, intente de nuevo.');
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" onClick={handleCloseWarning}>
      <h1 className="text-6xl lg:text-7xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit} className="bg-transparent p-6 rounded-xl border w-100 h-150" onClick={(e) => e.stopPropagation()}>
        <div className="mb-20 mt-8">
          <label className="block text-white font-semibold mb-4">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-4">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-20 mt-1"
            required
          />
        </div>
        {error && <AlertaError mensaje={error} onClose={handleCloseError} />}
        {success && <AlertaExito mensaje={success} onClose={handleCloseSuccess} />}
        {warning && <AlertaAdvertencia mensaje={warning} onClose={handleCloseWarning} />}
        <div className="flex justify-center">
          <button type="submit" className="w-50 bg-transparent border text-white p-2 rounded cursor-pointer hover:bg-amber-50 hover:text-black">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </div>
        <p className="mt-4 text-center">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
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