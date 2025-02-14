/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Chart } from 'chart.js';
import 'jspdf-autotable';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, getDoc } from 'firebase/firestore';
import AlertaModal from '../Modales/Alerta/Alerta';
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
  const [isPaused, setIsPaused] = useState(false);
  const [actividad, setActividad] = useState('');
  const [actividades, setActividades] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [finalizarModalIsOpen, setFinalizarModalIsOpen] = useState(false);
  const [editarModalIsOpen, setEditarModalIsOpen] = useState(false);
  const [detallesModalIsOpen, setDetallesModalIsOpen] = useState(false);
  const [comentariosModalIsOpen, setComentariosModalIsOpen] = useState(false);
  const [alertaModalIsOpen, setAlertaModalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [minutos, setMinutos] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [pauseTime, setPauseTime] = useState(null);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [comentarios, setComentarios] = useState('');

  // Efecto para manejar el cronómetro
  useEffect(() => {
    let cronometro;
    if (isRelojActivo && !isPaused) {
      cronometro = setInterval(() => {
        setTiempo((prevTiempo) => prevTiempo + 1);
      }, 1000);
    } else if (!isRelojActivo && tiempo !== 0) {
      clearInterval(cronometro);
    }
    return () => clearInterval(cronometro);
  }, [isRelojActivo, isPaused, tiempo]);

  // Efecto para cargar las actividades desde Firestore
  useEffect(() => {
    const fetchactividades = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const actividadesQuery = query(
            collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
          );
          const querySnapshot = await getDocs(actividadesQuery);
          const actividadesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

// Efecto para manejar el contador de pausa
useEffect(() => {
  let interval;
  if (isPaused) {
    interval = setInterval(() => {
      setTotalPauseTime((prevTotalPauseTime) => prevTotalPauseTime + 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isPaused]);

  // Efecto para mostrar la alerta cuando el contador llegue a 60 segundos
  useEffect(() => {
    if (tiempo >= 60 && !alertaModalIsOpen) {
      setAlertaModalIsOpen(true);
      setIsRelojActivo(false); // Detiene el reloj

      // Guardar los datos de la actividad
      const saveActivity = async () => {
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
            await addDoc(
              collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades'),
              actividadData
            ); // Agrega la actividad a Firestore
            const actividadesQuery = query(
              collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
            );
            const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades actualizadas
            const actividadesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
        setComentarios(''); // Reinicia los comentarios
      };

      saveActivity();
    }
  }, [tiempo, alertaModalIsOpen, actividad, comentarios, projectId, startTime, totalPauseTime]);

  // Función para cerrar la alerta y detener el contador
const handleCloseAlerta = useCallback(() => {
  
  setAlertaModalIsOpen(false);
  setIsRelojActivo(false); // Detiene el reloj
  setTiempo(0); // Reinicia el tiempo al cerrar la alerta
}, []);

  // Función para iniciar o reanudar el reloj
  const handleStart = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRelojActivo(true);
      const now = new Date();
      const pauseDuration = (now - pauseTime) / 1000; // Calcula la duración de la pausa en segundos
      setTotalPauseTime((prevTotalPauseTime) => prevTotalPauseTime + pauseDuration);
    } else {
      setModalIsOpen(true); // Abre el modal de inicio
    }
  }, [isPaused, pauseTime]);

  // Función para detener el reloj
  const handleStop = useCallback(() => {
    setIsRelojActivo(false); // Detiene el reloj
    setComentariosModalIsOpen(true); // Abre el modal de comentarios
  }, []);

  // Función para manejar el envío de comentarios
  const handleComentariosSubmit = useCallback(
    async (comentarios) => {
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
          await addDoc(
            collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades'),
            actividadData
          ); // Agrega la actividad a Firestore
          const actividadesQuery = query(
            collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
          );
          const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades actualizadas
          const actividadesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    },
    [actividad, tiempo, projectId, startTime, totalPauseTime]
  );

  // Función para manejar el envío del modal de inicio
  const handleModalSubmit = useCallback(() => {
    setActividad(inputValue); // Establece la actividad desde el input
    setIsRelojActivo(true); // Activa el reloj
    setModalIsOpen(false); // Cierra el modal de inicio
    setInputValue(''); // Reinicia el valor del input
    setStartTime(new Date()); // Establece la hora de inicio
  }, [inputValue]);

  // Función para generar el PDF del proyecto
  const handleDownload = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Obtener los datos del proyecto desde Firestore
        const proyectoRef = doc(db, 'usuarios', user.uid, 'proyectos', projectId);
        const proyectoSnapshot = await getDoc(proyectoRef);
        const proyectoData = proyectoSnapshot.data();

        // Obtener todas las actividades del proyecto
        const actividadesQuery = query(
          collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
        );
        const querySnapshot = await getDocs(actividadesQuery);
        const actividadesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Crear un nuevo PDF
        const pdf = new jsPDF();

        // Título del PDF
        pdf.setFontSize(18);
        pdf.text(`Informe del Proyecto: ${proyectoData.nombre}`, 10, 10);

        // Datos del proyecto en formato de tabla
        const proyectoTableData = [
          ['Nombre del Proyecto', proyectoData.nombre],
          ['Descripción', proyectoData.descripcion],
          ['Fecha de Creación', proyectoData.fechaCreacion],
          ['Total de Actividades', actividadesData.length],
        ];

        // Datos de las actividades en formato de tabla
        const actividadesTableData = actividadesData.map((actividad) => [
          actividad.actividad,
          actividad.minutos,
          actividad.fecha,
          actividad.horaInicio,
          actividad.horaFinal,
          actividad.interrupcion,
          actividad.comentarios,
          actividad.completada ? 'Sí' : 'No',
          actividad.unidades,
        ]);

        // Crear la tabla de actividades
        pdf.autoTable({
          startY: 20,
          head: [['Actividad', 'Minutos', 'Fecha', 'Hora Inicio', 'Hora Final', 'Interrupción', 'Comentarios', 'Completada', 'Unidades']],
          body: actividadesTableData,
          theme: 'grid',
        });

        // Crear un gráfico de barras con el tiempo total por actividad
        const actividadesAgregadas = actividadesData.reduce((acc, curr) => {
          const llave = curr.actividad;
          if (!acc[llave]) {
            acc[llave] = 0;
          }
          acc[llave] += curr.minutos;
          return acc;
        }, {});

        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(actividadesAgregadas),
            datasets: [
              {
                label: 'Minutos por Actividad',
                data: Object.values(actividadesAgregadas),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
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

        // Esperar a que la gráfica se renderice
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Capturar la gráfica como imagen
        const chartImage = await html2canvas(canvas);
        const chartImgData = chartImage.toDataURL('image/png');

        // Agregar la gráfica al PDF
        const imgWidth = 180;
        const imgHeight = (chartImage.height * imgWidth) / chartImage.width;
        pdf.addImage(chartImgData, 'PNG', 10, pdf.autoTable.previous.finalY + 10, imgWidth, imgHeight);

        // Guardar el PDF
        pdf.save(`informe_proyecto_${proyectoData.nombre}.pdf`);

        // Limpiar el canvas temporal
        document.body.removeChild(canvas);
      }
    } catch (error) {
      console.error('Error al generar el PDF: ', error);
    }
  }, [projectId]);

  // Función para manejar la pausa o reanudación del reloj
  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false); // Reanuda el reloj
      setIsRelojActivo(true);
      const now = new Date();
      const pauseDuration = (now - pauseTime) / 1000; // Calcula la duración de la pausa en segundos
      setTotalPauseTime((prevTotalPauseTime) => prevTotalPauseTime + pauseDuration);
    } else {
      setIsPaused(true); // Pausa el reloj
      setIsRelojActivo(false);
      setPauseTime(new Date()); // Establece la hora de pausa
    }
  }, [isPaused, pauseTime]);

  // Función para manejar la visualización de detalles de una actividad
  const handleDetalles = useCallback((activity) => {
    setSelectedActivity(activity); // Establece la actividad seleccionada
    setDetallesModalIsOpen(true); // Abre el modal de detalles
  }, []);

  // Función para manejar la edición de una actividad
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
        const actividadesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setActividades(actividadesData); // Actualiza el estado de actividades
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar actualizar el documento: ', e); // Maneja errores
    }
    setEditarModalIsOpen(false); // Cierra el modal de edición
    setInputValue(''); // Reinicia el valor del input
  }, [inputValue, selectedActivity, projectId]);

  // Función para manejar la eliminación de una actividad
  const handleDelete = useCallback(
    async (id) => {
      try {
        const user = auth.currentUser;
        if (user) {
          await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades', id)); // Elimina la actividad de Firestore
          const actividadesQuery = query(
            collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades')
          );
          const querySnapshot = await getDocs(actividadesQuery); // Obtiene las actividades actualizadas
          const actividadesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setActividades(actividadesData); // Actualiza el estado de actividades
        }
      } catch (e) {
        console.error('Ha ocurrido un error al intentar eliminar el documento: ', e); // Maneja errores
      }
    },
    [projectId]
  );

  // Cálculo de los minutos agregados por actividad
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

  // Datos para el gráfico de barras
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

  // Mostrar el cargador si está cargando
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full'>
        <NavBar /> {/* Barra de navegación */}
      </div>
      <h1 className='font-bold text-2xl sm:text-4xl font-sans text-center my-6 sm:my-12'>Tiempo de la actividad</h1>
      <p className='text-2xl sm:text-4xl font-bold text-center'>{new Date(tiempo * 1000).toISOString().slice(11, 19)}</p>
      <div className='flex flex-row gap-4 sm:gap-8'>
        {!isRelojActivo ? (
          <button
            className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125'
            onClick={handleStart}
          >
            Iniciar
          </button>
        ) : (
          <>
            <button
              className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125'
              onClick={handleStop}
            >
              Parar
            </button>
            <button
              className='font-bold rounded bg-transparent w-32 sm:w-40 border-2 px-4 py-2 my-4 sm:my-8 cursor-pointer hover:bg-amber-50 hover:text-black hover:scale-125'
              onClick={handlePauseResume}
            >
              {isPaused ? 'Reanudar' : 'Pausar'}
            </button>
          </>
        )}
      </div>
      {isPaused && (
        <div className='items-center'>
          <p className='text-2xl sm:text-xl text-green-700 font-bold text-center'>
            Pausado {pauseTime ? new Date((totalPauseTime + (new Date() - pauseTime) / 1000) * 1000).toISOString().slice(11, 19) : '00:00:00'} segundos
          </p>
        </div>
      )}
      <div className='w-full mt-4 sm:mt-8'>
        <h2 className='text-center text-xl sm:text-2xl font-bold'>Lista de Actividades</h2>
        <ul className='w-full max-w-2xl mx-auto'>
          {actividades.map((activity) => (
            <li key={activity.id} className='flex justify-between items-center p-2 border-b'>
              <span>{activity.actividad}</span>
              <div>
                <button
                  className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                  onClick={() => handleDetalles(activity)}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='blue'>
                    <path d='M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z' />
                  </svg>
                </button>
                <button
                  className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                  onClick={() => setEditarModalIsOpen(true)}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='green'>
                    <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
                  </svg>
                </button>
                <button
                  className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                  onClick={() => handleDelete(activity.id)}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='red'>
                    <path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z' />
                  </svg>
                </button>
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
      <AlertaModal
        isOpen={alertaModalIsOpen}
        onRequestClose={handleCloseAlerta}
      />
      <Footer />
    </div>
  );
};

export default Reloj;