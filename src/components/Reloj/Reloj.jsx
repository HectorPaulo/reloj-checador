import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import IniciarModal from '../Modales/Iniciar/Iniciar';
import FinalizarModal from '../Modales/Finalizar/Finalizar';
import EditarModal from '../Modales/Editar/Editar';

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

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-bold text-6xl font-sans text-center my-12'>Papureloj</h1>
      <h3 className='text-center font-bold mb-2 '>Tiempo de la papuactividad</h3>
      <p className='text-4xl font-bold text-center'>{new Date(tiempo * 1000).toISOString().slice(11, 19)}</p>
      {!isRelojActivo ? (
        <button className='font-bold rounded bg-transparent w-40 border-1 px-4 py-2 my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStart}>Iniciar</button>
      ) : (
        <button className='font-bold rounded bg-transparent w-40 border-1 px-4 py-2 my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStop}>Parar</button>
      )}
      <div className='w-full'>
        <h2 className='text-center text-bold '>Gráfica de Actividades</h2>
        <Bar data={agregadoData} />
      </div>
      <div className='w-full mt-8'>
        <h2 className='text-center text-bold '>Lista de Actividades</h2>
        <ul>
          {actividades.map((activity) => (
            <li key={activity.id} className='flex justify-between items-center p-2 border-b'>
              <span>{activity.actividad}</span>
              <div>
                <button className='mr-2 text-blue-500' onClick={() => handleEdit(activity)}>Editar</button>
                <button className='text-red-500' onClick={() => handleDelete(activity.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
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
    </div>
  );
};

export default Reloj;