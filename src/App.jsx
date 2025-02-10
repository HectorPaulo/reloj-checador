import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Reloj from './components/Reloj/Reloj';
import About from './components/About/About';
import Contacto from './components/Contacto/Contacto';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login';
import ListaActividades from './components/ListaActividades/ListaActividades';
import Loader from './components/Loader/Loader';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = () => {
    setUser(auth.currentUser);
    navigate('/');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Reloj /> : <Login onLogin={handleLogin} />} />
      <Route path="/about" element={user ? <About /> : <Login onLogin={handleLogin} />} />
      <Route path="/contacto" element={user ? <Contacto /> : <Login onLogin={handleLogin} />} />
      <Route path="/listaactividades" element={user ? <ListaActividades /> : <Login onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;