/* eslint-disable no-unused-vars */
// Desactiva la regla de ESLint que marca las variables no utilizadas como errores.

import React, { useState, useEffect } from 'react';
// Importa React y los hooks useState y useEffect desde la biblioteca de React.

import { Routes, Route, useNavigate } from 'react-router-dom';
// Importa Routes, Route y useNavigate desde react-router-dom para manejar la navegación en la aplicación.

import { auth } from './firebaseConfig';
// Importa el objeto auth desde la configuración de Firebase para manejar la autenticación.

import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Proyectos from './components/Proyectos/Proyectos';
import Reloj from './components/Reloj/Reloj';
import About from './components/About/About';
import Contacto from './components/Contacto/Contacto';
import ListaActividades from './components/ListaActividades/ListaActividades';
import NotFound from './components/NotFound/NotFound';
import Loader from './components/Loader/Loader';
// Importa varios componentes que se utilizarán en las rutas de la aplicación.

const App = () => {
  const [user, setUser] = useState(null);
  // Declara un estado llamado 'user' con su función para actualizarlo 'setUser', inicializado en null.

  const [isLoading, setIsLoading] = useState(true);
  // Declara un estado llamado 'isLoading' con su función para actualizarlo 'setIsLoading', inicializado en true.

  const navigate = useNavigate();
  // Obtiene la función 'navigate' de react-router-dom para cambiar de ruta programáticamente.

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    // Usa el hook useEffect para suscribirse a los cambios en el estado de autenticación del usuario.
    // Cuando el estado de autenticación cambia, actualiza el estado 'user' y establece 'isLoading' en false.

    return () => unsubscribe();
    // Devuelve una función de limpieza que se ejecuta cuando el componente se desmonta, desuscribiéndose de los cambios de autenticación.
  }, []);
  // El array vacío [] asegura que este efecto solo se ejecute una vez cuando el componente se monta.

  const handleLogin = () => {
    setUser(auth.currentUser);
    navigate('/');
  };
  // Define una función 'handleLogin' que establece el usuario actual de Firebase en el estado 'user' y navega a la ruta raíz.

  if (isLoading) {
    return <Loader />;
  }
  // Si 'isLoading' es true, renderiza el componente Loader para mostrar una pantalla de carga.

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Login onLogin={handleLogin} />} />
      <Route path="/proyectos" element={user ? <Proyectos onSelectProject={(projectId) => navigate(`/proyectos/${projectId}`)} /> : <Login onLogin={handleLogin} />} />
      <Route path="/proyectos/:projectId" element={user ? <Reloj /> : <Login onLogin={handleLogin} />} />
      <Route path="/about" element={user ? <About /> : <Login onLogin={handleLogin} />} />
      <Route path="/contacto" element={user ? <Contacto /> : <Login onLogin={handleLogin} />} />
      <Route path="/listaactividades" element={user ? <ListaActividades /> : <Login onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
  // Define las rutas de la aplicación usando el componente Routes.
  // Cada ruta renderiza un componente diferente basado en la URL y si el usuario está autenticado.
  // Si el usuario no está autenticado, redirige a la página de Login.
  // La ruta "*" captura todas las rutas no definidas y muestra el componente NotFound.
};

export default App;
// Exporta el componente App como el componente por defecto del módulo.