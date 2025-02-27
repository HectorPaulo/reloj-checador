import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';
import { Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import DetallesProyecto from '../Modales/DetallesProyecto/DetallesProyecto';
import ErrorModal from '../Modales/Error/Error';

// Definición del componente
const Proyectos = ({ onSelectProject }) => {
  // Variables de estado
  const [proyectos, setProyectos] = useState([]); // Almacena la lista de proyectos
  const [actividades, setActividades] = useState({}); // Almacena actividades para cada proyecto
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [inputValue, setInputValue] = useState(''); // Valor del input para nuevo proyecto
  const [selectedProject, setSelectedProject] = useState(null); // Estado para el proyecto seleccionado
  const [detallesProyectoModalIsOpen, setDetallesProyectoModalIsOpen] = useState(false); // Estado para el modal de detalles del proyecto
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [selectedDefecto, setSelectedDefecto] = useState(null);

  // Obtener proyectos y actividades al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = auth.currentUser; // Obtener usuario actual
        if (user) {
          const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Consulta para los proyectos del usuario
          const querySnapshot = await getDocs(projectsQuery); // Obtener proyectos
          const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapear datos de proyectos
          setProyectos(proyectosData); // Establecer estado de proyectos

          // Obtener actividades para cada proyecto
          const actividadesData = {};
          for (const project of proyectosData) {
            const actividadesQuery = query(
              collection(db, 'usuarios', user.uid, 'proyectos', project.id, 'actividades')
            );
            const actividadesSnapshot = await getDocs(actividadesQuery); // Obtener actividades
            actividadesData[project.id] = actividadesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapear datos de actividades
          }
          setActividades(actividadesData); // Establecer estado de actividades
        }
      } catch (error) {
        console.error('Error al buscar los proyectos: ', error); // Registrar error
      } finally {
        setIsLoading(false); // Establecer estado de carga a falso
      }
    };
    fetchProjects(); // Llamar a la función fetchProjects
  }, []);

  // Función para agregar un nuevo proyecto
  const handleAddProject = useCallback(async () => {
    if (inputValue.trim() === '') {
      return; // No hacer nada si el input está vacío
    }
    try {
      const user = auth.currentUser; // Obtener usuario actual
      if (user) {
        const docRef = await addDoc(collection(db, 'usuarios', user.uid, 'proyectos'), {
          nombre: inputValue, // Agregar nuevo proyecto con el valor del input
          fechaCreacion: new Date().toISOString() // Agregar la fecha de creación del proyecto
        });

        // Crear actividades con valores vacíos
        const actividades = [
          'Planificación',
          'Análisis',
          'Codificación',
          'Pruebas',
          'Lanzamiento',
          'Revision',
          'RevisionCodigo',
          'Diagramar',
          'Reunion'
        ];

        for (const actividad of actividades) {
          await addDoc(collection(db, 'usuarios', user.uid, 'proyectos', docRef.id, 'actividades'), {
            actividad,
            minutos: 0,
            fecha: '',
            horaInicio: '',
            horaFinal: '',
            interrupcion: 0,
            comentarios: ''
          });
        }

        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Consulta para los proyectos del usuario
        const querySnapshot = await getDocs(projectsQuery); // Obtener proyectos
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapear datos de proyectos
        setProyectos(proyectosData); // Establecer estado de proyectos
        setInputValue(''); // Limpiar valor del input
        onSelectProject(docRef.id); // Redirigir a la página del proyecto recién creado
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar agregar el proyecto: ', e); // Registrar error
    }
  }, [inputValue, onSelectProject]);

  const handleDetailsProyecto = useCallback((project) => {
    setSelectedProject(project);
    setDetallesProyectoModalIsOpen(true);
  }, []);

  // Función para eliminar un proyecto
  const handleDeleteProject = useCallback(async (id) => {
    try {
      const user = auth.currentUser; // Obtener usuario actual
      if (user) {
        await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', id)); // Eliminar proyecto por id
        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos'); // Consulta para los proyectos del usuario
        const querySnapshot = await getDocs(projectsQuery); // Obtener proyectos
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Mapear datos de proyectos
        setProyectos(proyectosData); // Establecer estado de proyectos
      }
    } catch (e) {
      console.error('Ha ocurrido un error al intentar eliminar el proyecto: ', e); // Registrar error
    }
  }, []);

  // Función para descargar el PDF de un proyecto
  const handleDownloadPDF = useCallback(async (projectId, projectName) => {
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
        pdf.text(`Informe del Proyecto: ${projectName}`, 10, 10);
        proyectoData.fechaCreacion = proyectoData.fechaCreacion ? new Date(proyectoData.fechaCreacion).toLocaleDateString() : 'Fecha no disponible';
        proyectoData.fechaFinalizacion = new Date().toLocaleDateString();
        // Datos del proyecto en formato de tabla
        const proyectoTableData = [
          ['Nombre del Proyecto', proyectoData.nombre],
          ['Fecha de Inicio', proyectoData.fechaCreacion],
          ['Fecha de Finalización', proyectoData.fechaFinalizacion],
          ['Total de Actividades', actividadesData.length],
        ];

        // Crear la tabla de datos del proyecto
        pdf.autoTable({
          startY: 20,
          head: [['Campo', 'Valor']],
          body: proyectoTableData,
          theme: 'grid',
        });

        // Datos de las actividades en formato de tabla
        const actividadesTableData = actividadesData.map((actividad) => [
          actividad.actividad,
          actividad.minutos,
          actividad.fecha,
          actividad.horaInicio,
          actividad.horaFinal,
          actividad.interrupcion,
          actividad.comentarios,
        ]);

        // Crear la tabla de actividades
        pdf.autoTable({
          startY: pdf.autoTable.previous.finalY + 10,
          head: [['Actividad', 'Minutos', 'Fecha', 'Hora Inicio', 'Hora Final', 'Interrupción', 'Comentarios']],
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
        pdf.save(`informe_proyecto_${projectName}.pdf`);

        // Limpiar el canvas temporal
        document.body.removeChild(canvas);
      }
    } catch (error) {
      console.error('Error al generar el PDF: ', error);
    }
  }, []);

  const handleAddError = useCallback(async (errorData) => {
    try {
      const user = auth.currentUser;
      if (user && selectedProject) {
        const proyectoRef = doc(db, 'usuarios', user.uid, 'proyectos', selectedProject.id);
        const proyectoSnapshot = await getDoc(proyectoRef);
        const proyectoData = proyectoSnapshot.data();

        const defectos = proyectoData.defector || [];
        defectos.push(errorData);

        await updateDoc(proyectoRef, { defector: defectos });

        const updatedProject = { ...selectedProject, defector: defectos };
        setSelectedProject(updatedProject);

        const projectsQuery = collection(db, 'usuarios', user.uid, 'proyectos');
        const querySnapshot = await getDocs(projectsQuery);
        const proyectosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProyectos(proyectosData);
      }
    } catch (error) {
      console.error('Error al agregar el defecto: ', error);
    }
  }, [selectedProject]);

  const handleEditError = (defecto) => {
    setSelectedDefecto(defecto);
    setErrorModalIsOpen(true);
  };

  const handleSaveError = (formData) => {
    handleAddError(formData);
    setSelectedDefecto(null);
  };

  // Cálculo memorizado de actividades agregadas
  const actividadesAgregadas = useMemo(() => {
    const agregado = {};
    for (const projectId in actividades) {
      agregado[projectId] = actividades[projectId].reduce((acc, curr) => {
        const llave = curr.actividad; // Clave de actividad
        if (!acc[llave]) {
          acc[llave] = 0; // Inicializar si no está presente
        }
        acc[llave] += curr.minutos; // Sumar minutos
        return acc;
      }, {});
    }
    return agregado;
  }, [actividades]);

  // Datos memorizados para la gráfica
  const agregadoData = useMemo(() => {
    const data = {};
    for (const projectId in actividadesAgregadas) {
      data[projectId] = {
        labels: Object.keys(actividadesAgregadas[projectId]), // Etiquetas de actividades
        datasets: [
          {
            label: 'Minutos por actividad', // Etiqueta del dataset
            data: Object.values(actividadesAgregadas[projectId]), // Datos de actividades
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras
          },
        ],
      };
    }
    return data;
  }, [actividadesAgregadas]);

  // Renderizar loader si los datos aún se están cargando
  if (isLoading) {
    return <Loader />;
  }

  // Renderizar componente
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex-grow'>
        <h1 className='font-bold text-4xl sm:text-6xl font-sans text-center my-6 sm:my-12'>Proyectos</h1>
        <div className='w-full max-w-2xl mx-auto'>
          <ul className='p-10 w-full mt-4'>
            {proyectos.map((project) => (
              <li key={project.id} className='flex justify-between items-center border-b cursor-pointer hover:bg-gray-700'>
                <div onClick={() => onSelectProject(project.id)} className='p-2 w-full h-full'>
                  <span>{project.nombre}</span>
                </div>
                <div className='flex items-center'>
                  <button
                    className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                    onClick={() => handleDetailsProyecto(project)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                  </button>
                  <button
                    className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                    onClick={() => handleDownloadPDF(project.id, project.nombre)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="yellow">
                      <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                    </svg>
                  </button>
                  <button
                    className='cursor-pointer hover:scale-110 mx-2 sm:mx-4'
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="red">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4 className='font-semibold text-xl my-4'>Nuevo proyecto</h4>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg disabled:bg-white disabled:text-black bg-transparent text-white"
            placeholder="Nombre del proyecto"
          />
          <div className="flex justify-center">
            <button 
              onClick={async () => {
                setIsLoading(true);
                await handleAddProject();
                setIsLoading(false);
              }} 
              className="w-50 px-6 py-3 my-4 bg-transparent border text-white cursor-pointer rounded hover:bg-white hover:text-black hover:scale-110 disabled:text-black disabled:bg-gray-700" 
              disabled={!inputValue.trim()}
            >
              Agregar
            </button>
          </div>
        </div>
        {proyectos.map((project) => (
          <div key={project.id} className='w-full max-w-2xl mx-auto mt-8'>
            <h2 className="text-2xl font-bold text-center">Gráfica de Actividades - {project.nombre}</h2>
            <Bar 
              data={{ 
                ...agregadoData[project.id], 
                datasets: [{ 
                  ...agregadoData[project.id].datasets[0], 
                  backgroundColor: '#F71735' 
                }] 
              }} 
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${value} minutos (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        ))}
      </div>
            <DetallesProyecto 
            isOpen={detallesProyectoModalIsOpen}
            onRequestClose={() => setDetallesProyectoModalIsOpen(false)}
            proyecto={selectedProject}
            onEditError={handleEditError}
            />
      <ErrorModal
        isOpen={errorModalIsOpen}
        onRequestClose={() => setErrorModalIsOpen(false)}
        onSubmit={handleSaveError}
        defecto={selectedDefecto}
      />
      <Footer />
    </div>
  );
};

// Validación de PropTypes
Proyectos.propTypes = {
  onSelectProject: PropTypes.func.isRequired,
};

export default Proyectos;