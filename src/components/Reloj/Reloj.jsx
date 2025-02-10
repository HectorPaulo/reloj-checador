/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import IniciarModal from '../Modales/Iniciar/Iniciar';
import FinalizarModal from '../Modales/Finalizar/Finalizar';
import EditarModal from '../Modales/Editar/Editar';
import DetallesModal from '../Modales/Detalles/DetallesModal';
import ComentariosModal from '../Modales/Comentarios/Comentarios';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import { useParams } from 'react-router-dom';

const Reloj = () => {
  const { projectId } = useParams();
  const [tiempo, setTiempo] = useState(0);
  const [isRelojActivo, setIsRelojActivo] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Nuevo estado para manejar la pausa
  const [actividad, setActividad] = useState('');
  const [actividades, setActividades] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [finalizarModalIsOpen, setFinalizarModalIsOpen] = useState(false);
  const [editarModalIsOpen, setEditarModalIsOpen] = useState(false);
  const [detallesModalIsOpen, setDetallesModalIsOpen] = useState(false); // Nuevo estado para manejar el modal de detalles
  const [comentariosModalIsOpen, setComentariosModalIsOpen] = useState(false); // Nuevo estado para manejar el modal de comentarios
  const [inputValue, setInputValue] = useState('');
  const [minutos, setMinutos] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(null); // Nuevo estado para manejar la hora de inicio
  const [pauseTime, setPauseTime] = useState(null); // Nuevo estado para manejar la hora de pausa
  const [totalPauseTime, setTotalPauseTime] = useState(0); // Nuevo estado para manejar el tiempo total de pausa
  const [comentarios, setComentarios] = useState(''); // Nuevo estado para manejar los comentarios

  useEffect(() => {
    let cronometro;
    if (isRelojActivo && !isPaused) {
      cronometro = setInterval(() => {
        setTiempo(prevTiempo => prevTiempo + 1);
      }, 1000);
    } else if (!isRelojActivo && tiempo !== 0) {
      clearInterval(cronometro);
    }
    return () => clearInterval(cronometro);
  }, [isRelojActivo, isPaused, tiempo]);

  useEffect(() => {
    const fetchactividades = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const actividadesQuery = query(
            collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
          );
          const querySnapshot = await getDocs(actividadesQuery);
          const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setActividades(actividadesData);
        }
      } catch (error) {
        console.error('Error al buscar las actividades: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchactividades();
  }, [projectId]);

  const handleStart = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRelojActivo(true);
      const now = new Date();
      const pauseDuration = (now - pauseTime) / 1000; // Calcular la duración de la pausa en segundos
      setTotalPauseTime(prevTotalPauseTime => prevTotalPauseTime + pauseDuration);
    } else {
      setModalIsOpen(true);
    }
  }, [isPaused, pauseTime]);

  const handleStop = useCallback(() => {
    setIsRelojActivo(false);
    setComentariosModalIsOpen(true); // Abrir el modal de comentarios
  }, []);

  const handleComentariosSubmit = useCallback(async (comentarios) => {
    const now = new Date();
    const minutos = Math.floor(tiempo / 60);
    setMinutos(minutos);
    try {
      const user = auth.currentUser;
      if (user) {
        const actividadData = {
          actividad: actividad,
          minutos: minutos,
          marcaTiempo: now,
          fecha: startTime.toLocaleDateString(),
          horaInicio: startTime.toLocaleTimeString(),
          horaFinal: now.toLocaleTimeString(),
          interrupcion: totalPauseTime,
          comentarios: comentarios,
          completada: true,
          unidades: 1,
        };
        await addDoc(collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades'), actividadData);
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery);
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData);
        setSelectedActivity(actividadData); // Establecer la actividad seleccionada para mostrar los detalles
        setDetallesModalIsOpen(true); // Abrir el modal de detalles
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el documento: ', e);
    }
    setTiempo(0);
    setActividad('');
    setStartTime(null);
    setPauseTime(null);
    setTotalPauseTime(0);
    setComentariosModalIsOpen(false);
    setFinalizarModalIsOpen(true);
  }, [actividad, tiempo, projectId, startTime, totalPauseTime]);

  const handleModalSubmit = useCallback(() => {
    setActividad(inputValue);
    setIsRelojActivo(true);
    setModalIsOpen(false);
    setInputValue('');
    setStartTime(new Date()); // Establecer la hora de inicio
  }, [inputValue]);

  const handleEdit = useCallback((activity) => {
    setSelectedActivity(activity);
    setInputValue(activity.actividad);
    setEditarModalIsOpen(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const activityRef = doc(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades', selectedActivity.id);
        await updateDoc(activityRef, { actividad: inputValue });
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery);
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData);
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar actualizar el documento: ', e);
    }
    setEditarModalIsOpen(false);
    setInputValue('');
  }, [inputValue, selectedActivity, projectId]);

  const handleDelete = useCallback(async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades', id));
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery);
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData);
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el documento: ', e);
    }
  }, [projectId]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRelojActivo(true);
      const now = new Date();
      const pauseDuration = (now - pauseTime) / 1000; // Calcular la duración de la pausa en segundos
      setTotalPauseTime(prevTotalPauseTime => prevTotalPauseTime + pauseDuration);
    } else {
      setIsPaused(true);
      setIsRelojActivo(false);
      setPauseTime(new Date()); // Establecer la hora de pausa
    }
  }, [isPaused, pauseTime]);

  const handleDetalles = useCallback((activity) => {
    setSelectedActivity(activity);
    setDetallesModalIsOpen(true);
  }, []);

  const actividadesAgregadas = useMemo(() => {
    const agregado = actividades.reduce((acc, curr) => {
      const llave = curr.actividad;
      if (!acc[llave]) {
        acc[llave] = 0;
      }
      acc[llave] += curr.minutos;
      return acc;
    }, {});
    return agregado;
  }, [actividades]);

  const agregadoData = useMemo(() => {
    return {
      labels: Object.keys(actividadesAgregadas),
      datasets: [
        {
          label: 'Minutos por actividad',
          data: Object.values(actividadesAgregadas),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }, [actividadesAgregadas]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full'>
        <NavBar />
      </div>
      <h1 className='font-bold text-4xl sm:text-6xl font-sans text-center my-6 sm:my-12'>Tiempo de la actividad</h1>
      <p className='text-2xl sm:text-4xl font-bold text-center'>{new Date(tiempo * 1000).toISOString().slice(11, 19)}</p>
      <div className='flex flex-row gap-4 sm:gap-8'>
      {!isRelojActivo ? (
        <button className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStart}>Iniciar</button>
      ) : (
        <>
          <button className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStop}>Parar</button>
          <button className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handlePauseResume}>{isPaused ? 'Reanudar' : 'Pausar'}</button>
        </>
      )}
        </div>
      <div className='w-full mt-4 sm:mt-8'>
        <h2 className='text-center text-xl sm:text-2xl font-bold'>Lista de Actividades</h2>
        <ul className='w-full max-w-2xl mx-auto'>
          {actividades.map((activity) => (
            <li key={activity.id} className='flex justify-between items-center p-2 border-b'>
              <span>{activity.actividad}</span>
              <div>
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDetalles(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button>
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleEdit(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDelete(activity.id)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='w-full mt-4 sm:mt-8'>
        <h2 className='text-center font-bold text-xl sm:text-2xl'>Gráfica de Actividades</h2>
        <div className='w-full max-w-2xl mx-auto'>
          <Bar data={agregadoData} />
        </div>
      </div>
      <IniciarModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleModalSubmit={handleModalSubmit}
      />
      <FinalizarModal
        isOpen={finalizarModalIsOpen}
        onRequestClose={() => setFinalizarModalIsOpen(false)}
        actividad={actividad}
        minutos={minutos}
      />
      <EditarModal
        isOpen={editarModalIsOpen}
        onRequestClose={() => setEditarModalIsOpen(false)}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleEditSubmit={handleEditSubmit}
      />
      <DetallesModal
        isOpen={detallesModalIsOpen}
        onRequestClose={() => setDetallesModalIsOpen(false)}
        actividad={selectedActivity}
      />
      <ComentariosModal
        isOpen={comentariosModalIsOpen}
        onRequestClose={() => setComentariosModalIsOpen(false)}
        onSubmit={handleComentariosSubmit}
      />
      <Footer />
    </div>
  );
};

export default Reloj;