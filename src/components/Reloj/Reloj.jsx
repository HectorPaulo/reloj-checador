/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Importa React y hooks
import PropTypes from 'prop-types'; // Importa PropTypes para validación de tipos
import html2canvas from 'html2canvas'; // Importa librería para capturar contenido de un div
import { jsPDF } from 'jspdf'; // Importa librería para crear PDFs
import { Chart, BarController, CategoryScale, LinearScale, BarElement } from 'chart.js';
import 'jspdf-autotable'; // Importa librería para crear tablas en PDFs
import { db, auth } from '../../firebaseConfig'; // Importa configuración de Firebase
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'; // Importa funciones de Firestore
import { Bar } from 'react-chartjs-2'; // Importa componente de gráfico de barras
import 'chart.js/auto'; // Importa configuración automática de Chart.js
import IniciarModal from '../Modales/Iniciar/Iniciar'; // Importa modal de inicio
import FinalizarModal from '../Modales/Finalizar/Finalizar'; // Importa modal de finalización
import EditarModal from '../Modales/Editar/Editar'; // Importa modal de edición
import DetallesModal from '../Modales/Detalles/DetallesModal'; // Importa modal de detalles
import ComentariosModal from '../Modales/Comentarios/Comentarios'; // Importa modal de comentarios
import NavBar from '../Navbar/Navbar'; // Importa componente de barra de navegación
import Footer from '../Footer/Footer'; // Importa componente de pie de página
import Loader from '../Loader/Loader'; // Importa componente de cargador
import { useParams } from 'react-router-dom'; // Importa hook para obtener parámetros de la URL

const Reloj = () => {
  const { projectId } = useParams(); // Obtiene el ID del proyecto desde la URL
  const [tiempo, setTiempo] = useState(0); // Estado para el tiempo transcurrido
  const [isRelojActivo, setIsRelojActivo] = useState(false); // Estado para saber si el reloj está activo
  const [isPaused, setIsPaused] = useState(false); // Estado para manejar la pausa
  const [actividad, setActividad] = useState(''); // Estado para la actividad actual
  const [actividades, setActividades] = useState([]); // Estado para la lista de actividades
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para manejar la apertura del modal de inicio
  const [finalizarModalIsOpen, setFinalizarModalIsOpen] = useState(false); // Estado para manejar la apertura del modal de finalización
  const [editarModalIsOpen, setEditarModalIsOpen] = useState(false); // Estado para manejar la apertura del modal de edición
  const [detallesModalIsOpen, setDetallesModalIsOpen] = useState(false); // Estado para manejar la apertura del modal de detalles
  const [comentariosModalIsOpen, setComentariosModalIsOpen] = useState(false); // Estado para manejar la apertura del modal de comentarios
  const [inputValue, setInputValue] = useState(''); // Estado para el valor del input
  const [minutos, setMinutos] = useState(0); // Estado para los minutos transcurridos
  const [selectedActivity, setSelectedActivity] = useState(null); // Estado para la actividad seleccionada
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga de datos
  const [startTime, setStartTime] = useState(null); // Estado para la hora de inicio
  const [pauseTime, setPauseTime] = useState(null); // Estado para la hora de pausa
  const [totalPauseTime, setTotalPauseTime] = useState(0); // Estado para el tiempo total de pausa
  const [comentarios, setComentarios] = useState(''); // Estado para los comentarios

  useEffect(() => {
    let cronometro;
    if (isRelojActivo && !isPaused) {
      cronometro = setInterval(() => {
        setTiempo(prevTiempo => prevTiempo + 1); // Incrementa el tiempo cada segundo
      }, 1000);
    } else if (!isRelojActivo && tiempo !== 0) {
      clearInterval(cronometro); // Limpia el intervalo si el reloj no está activo
    }
    return () => clearInterval(cronometro); // Limpia el intervalo al desmontar el componente
  }, [isRelojActivo, isPaused, tiempo]);

  useEffect(() => {
    const fetchactividades = async () => {
      try {
        const user = auth.currentUser; // Obtiene el usuario actual
        if (user) {
          const actividadesQuery = query(
            collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
          );
          const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades desde Firestore
          const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setActividades(actividadesData); // Establece las actividades en el estado
        }
      } catch (error) {
        console.error('Error al buscar las actividades: ', error); // Maneja errores
      } finally {
        setIsLoading(false); // Establece el estado de carga a falso
      }
    };
    fetchactividades(); // Llama a la función para obtener actividades
  }, [projectId]);

  useEffect(() => {
    let interval;
    if (isPaused) {
      interval = setInterval(() => {
        setTotalPauseTime(prevTotalPauseTime => prevTotalPauseTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleStart = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRelojActivo(true);
      const now = new Date();
      const pauseDuration = (now - pauseTime) / 1000; // Calcula la duración de la pausa en segundos
      setTotalPauseTime(prevTotalPauseTime => prevTotalPauseTime + pauseDuration);
    } else {
      setModalIsOpen(true); // Abre el modal de inicio
    }
  }, [isPaused, pauseTime]);

  const handleStop = useCallback(() => {
    setIsRelojActivo(false); // Detiene el reloj
    setComentariosModalIsOpen(true); // Abre el modal de comentarios
  }, []);

  const handleComentariosSubmit = useCallback(async (comentarios) => {
    const now = new Date();
    const minutos = Math.floor(tiempo / 60); // Calcula los minutos transcurridos
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
        await addDoc(collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades'), actividadData); // Agrega la actividad a Firestore
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades actualizadas
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData); // Actualiza el estado de actividades
        setSelectedActivity(actividadData); // Establece la actividad seleccionada
        setDetallesModalIsOpen(true); // Abre el modal de detalles
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el documento: ', e); // Maneja errores
    }
    setTiempo(0); // Reinicia el tiempo
    setActividad(''); // Reinicia la actividad
    setStartTime(null); // Reinicia la hora de inicio
    setPauseTime(null); // Reinicia la hora de pausa
    setTotalPauseTime(0); // Reinicia el tiempo total de pausa
    setComentariosModalIsOpen(false); // Cierra el modal de comentarios
    setFinalizarModalIsOpen(true); // Abre el modal de finalización
  }, [actividad, tiempo, projectId, startTime, totalPauseTime]);

  const handleModalSubmit = useCallback(() => {
    setActividad(inputValue); // Establece la actividad desde el input
    setIsRelojActivo(true); // Activa el reloj
    setModalIsOpen(false); // Cierra el modal de inicio
    setInputValue(''); // Reinicia el valor del input
    setStartTime(new Date()); // Establece la hora de inicio
  }, [inputValue]);

  const handleDownload = useCallback(async (activity) => {
    // Crear un nuevo PDF
    const pdf = new jsPDF();
  
    // Título del PDF
    pdf.setFontSize(18);
    pdf.text('Detalles de la Actividad', 10, 10);
  
    // Datos de la actividad en formato de tabla
    const data = [
      ['Actividad', activity.actividad],
      ['Minutos', activity.minutos],
      ['Fecha', activity.fecha],
      ['Hora de Inicio', activity.horaInicio],
      ['Hora de Finalización', activity.horaFinal],
      ['Interrupción', activity.interrupcion],
      ['Comentarios', activity.comentarios],
    ];
  
    // Crear la tabla
    pdf.autoTable({
      startY: 20, // Posición Y donde comienza la tabla
      head: [['Campo', 'Valor']], // Encabezados de la tabla
      body: data, // Datos de la tabla
      theme: 'grid', // Estilo de la tabla
    });
  
    // Crear un canvas temporal para la gráfica
    const canvas = document.createElement('canvas');
    canvas.width = 400; // Ancho del canvas
    canvas.height = 200; // Alto del canvas
    document.body.appendChild(canvas); // Agrega el canvas al DOM temporalmente
  
    // Configuración de la gráfica de barras
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [activity.actividad], // Nombre de la actividad
        datasets: [
          {
            label: 'Minutos',
            data: [activity.minutos], // Minutos de la actividad
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  
    // Espera a que la gráfica se renderice completamente
    await new Promise(resolve => setTimeout(resolve, 500));

    // Captura la gráfica como imagen
    const chartImage = await html2canvas(canvas);
    const chartImgData = chartImage.toDataURL('image/png');
  
    // Agrega la gráfica al PDF
    const imgWidth = 180; // Ancho de la imagen en el PDF
    const imgHeight = (chartImage.height * imgWidth) / chartImage.width; // Altura proporcional
    pdf.addImage(chartImgData, 'PNG', 10, pdf.autoTable.previous.finalY + 10, imgWidth, imgHeight);
  
    // Guardar el PDF
    pdf.save('actividad.pdf');
  
    // Limpiar el canvas temporal
    document.body.removeChild(canvas);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const activityRef = doc(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades', selectedActivity.id);
        await updateDoc(activityRef, { actividad: inputValue }); // Actualiza la actividad en Firestore
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades actualizadas
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData); // Actualiza el estado de actividades
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar actualizar el documento: ', e); // Maneja errores
    }
    setEditarModalIsOpen(false); // Cierra el modal de edición
    setInputValue(''); // Reinicia el valor del input
  }, [inputValue, selectedActivity, projectId]);

  const handleDelete = useCallback(async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades', id)); // Elimina la actividad de Firestore
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades actualizadas
        const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData); // Actualiza el estado de actividades
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el documento: ', e); // Maneja errores
    }
  }, [projectId]);

  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false); // Reanuda el reloj
      setIsRelojActivo(true);
      const now = new Date();
      const pauseDuration = (now - pauseTime) / 1000; // Calcula la duración de la pausa en segundos
      setTotalPauseTime(prevTotalPauseTime => prevTotalPauseTime + pauseDuration);
    } else {
      setIsPaused(true); // Pausa el reloj
      setIsRelojActivo(false);
      setPauseTime(new Date()); // Establece la hora de pausa
    }
  }, [isPaused, pauseTime]);

  const handleDetalles = useCallback((activity) => {
    setSelectedActivity(activity); // Establece la actividad seleccionada
    setDetallesModalIsOpen(true); // Abre el modal de detalles
  }, []);

  const actividadesAgregadas = useMemo(() => {
    const agregado = actividades.reduce((acc, curr) => {
      const llave = curr.actividad;
      if (!acc[llave]) {
        acc[llave] = 0;
      }
      acc[llave] += curr.minutos; // Suma los minutos por actividad
      return acc;
    }, {});
    return agregado;
  }, [actividades]);
  
  const agregadoData = useMemo(() => {
    return {
      labels: Object.keys(actividadesAgregadas), // Etiquetas de las actividades
      datasets: [
        {
          label: 'Minutos por actividad',
          data: Object.values(actividadesAgregadas), // Datos de los minutos por actividad
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de fondo del gráfico
        },
      ],
    };
  }, [actividadesAgregadas]);
  

  if (isLoading) {
    return <Loader />; // Muestra el cargador si está cargando
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full'>
        <NavBar /> {/* Barra de navegación */}
      </div>
      <h1 className='font-bold text-4xl sm:text-6xl font-sans text-center my-6 sm:my-12'>Tiempo de la actividad</h1>
      <p className='text-2xl sm:text-4xl font-bold text-center'>{new Date(tiempo * 1000).toISOString().slice(11, 19)}</p>
      <div className='flex flex-row gap-4 sm:gap-8'>
      {!isRelojActivo ? (
        <button className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStart}>Iniciar</button> // Botón para iniciar el reloj
      ) : (
        <>
          <button className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handleStop}>Parar</button> {/* Botón para parar el reloj */}
          <button className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125' onClick={handlePauseResume}>{isPaused ? 'Reanudar' : 'Pausar'}</button> {/* Botón para pausar o reanudar el reloj */}
            </>
                )}
            </div>
                {
            isPaused ? (
              <div className='items-center'>
                <p className='text-2xl sm:text-xl text-green-700 font-bold text-center'>
                  Pausado {pauseTime ? new Date((totalPauseTime + (new Date() - pauseTime) / 1000) * 1000).toISOString().slice(11, 19) : '00:00:00'} segundos
                </p>
              </div>
            ) : ('')
                }
                <div className='w-full mt-4 sm:mt-8'>
            <h2 className='text-center text-xl sm:text-2xl font-bold'>Lista de Actividades</h2>
            <ul className='w-full max-w-2xl mx-auto'>
              {actividades.map((activity) => (
                <li key={activity.id} className='flex justify-between items-center p-2 border-b'>
                  <span>{activity.actividad}</span>
                  <div>
              <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDownload(activity)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="yellow"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
              </button>
              <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDetalles(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="blue"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></button> 
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleEdit(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="green"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button> {/* Botón para editar la actividad */}
                <button className='cursor-pointer hover:scale-110 mx-2 sm:mx-4' onClick={() => handleDelete(activity.id)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button> {/* Botón para eliminar la actividad */}
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