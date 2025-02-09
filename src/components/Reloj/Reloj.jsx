/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import IniciarModal from '../Modales/Iniciar/Iniciar';
import FinalizarModal from '../Modales/Finalizar/Finalizar';
import EditarModal from '../Modales/Editar/Editar';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';

const Reloj = () => {
  const [tiempo, setTiempo] = useState(0);
  const [isRelojActivo, setIsRelojActivo] = useState(false);
  const [actividad, setActividad] = useState('');
  const [actividades, setActividades] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [finalizarModalIsOpen, setFinalizarModalIsOpen] = useState(false);
  const [editarModalIsOpen, setEditarModalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [minutos, setMinutos] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cronometro;
    if (isRelojActivo) {
      cronometro = setInterval(() => {
        setTiempo(prevTiempo => prevTiempo + 1);
      }, 1000);
    } else if (!isRelojActivo && tiempo !== 0) {
      clearInterval(cronometro);
    }
    return () => clearInterval(cronometro);
  }, [isRelojActivo, tiempo]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'actividades'));
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData);
      } catch (error) {
        console.error('Error al buscar las actividades: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleStart = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const handleStop = useCallback(async () => {
    setIsRelojActivo(false);
    const minutos = Math.floor(tiempo / 60);
    setMinutos(minutos);
    try {
      await addDoc(collection(db, 'actividades'), {
        actividad: actividad,
        minutos: minutos,
        marcaTiempo: new Date(),
      });
      const querySnapshot = await getDocs(collection(db, 'actividades'));
      const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActividades(activitiesData);
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el documento: ', e);
    }
    setTiempo(0);
    setActividad('');
    setFinalizarModalIsOpen(true);
  }, [actividad, tiempo]);

  const handleModalSubmit = useCallback(() => {
    setActividad(inputValue);
    setIsRelojActivo(true);
    setModalIsOpen(false);
    setInputValue('');
  }, [inputValue]);

  const handleEdit = useCallback((activity) => {
    setSelectedActivity(activity);
    setInputValue(activity.actividad);
    setEditarModalIsOpen(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    try {
      const activityRef = doc(db, 'actividades', selectedActivity.id);
      await updateDoc(activityRef, { actividad: inputValue });
      const querySnapshot = await getDocs(collection(db, 'actividades'));
      const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActividades(activitiesData);
    } catch (e) {
      console.error('Ha ocurrido un error al intentar actualizar el documento: ', e);
    }
    setEditarModalIsOpen(false);
    setInputValue('');
  }, [inputValue, selectedActivity]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'actividades', id));
      const querySnapshot = await getDocs(collection(db, 'actividades'));
      const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActividades(activitiesData);
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el documento: ', e);
    }
  }, []);

  const actividadesAgregadas = useMemo(() => {
    const agregado = actividades.reduce((acc, curr) => {
      const fecha = new Date(curr.marcaTiempo.seconds * 1000).toLocaleDateString();
      const llave = `${curr.actividad} (${fecha})`;
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
      <h1 className='font-bold text-6xl font-sans text-center my-12'>Tiempo de la actividad</h1>
      <p className='text-4xl font-bold text-center'>{new Date(tiempo * 1000).toISOString().slice(11, 19)}</p>
      {!isRelojActivo ? (
        <button className='font-bold rounded bg-transparent w-40 border-2 px-4 py-2 my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStart}>Iniciar</button>
      ) : (
        <button className='font-bold rounded bg-transparent w-40 border-2 px-4 py-2 my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStop}>Parar</button>
      )}
      <div className='w-full mt-8'>
        <h2 className='text-center text-2xl font-bold'>Lista de Actividades</h2>
        <ul className='w-100 max-w-2xl mx-auto'>
          {actividades.map((activity) => (
            <li key={activity.id} className='flex justify-between items-center p-2 border-b'>
              <span>{activity.actividad}</span>
              <div>
                <button className='cursor-pointer hover:scale-110 mx-4' onClick={() => handleEdit(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                <button className='cursor-pointer hover:scale-110 mx-4' onClick={() => handleDelete(activity.id)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='w-full mt-8'>
        <h2 className='text-center font-bold'>Gráfica de Actividades</h2>
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
      <Footer />
    </div>
  );
};

export default Reloj;