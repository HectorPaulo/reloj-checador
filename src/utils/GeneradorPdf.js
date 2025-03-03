import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { auth } from '../firebaseConfig';
import { getActividades, getDefectos, getProjectById } from '../controllers/controller';
import { generarGraficaActividades } from './GeneradorGrafica';
import { agruparActividades } from './agrupadorActividades';

export const generarPDF = async (projectId) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const doc = new jsPDF();

      // Obtener los detalles del proyecto
      const project = await getProjectById(projectId);
      const projectName = project.nombre;

      // Obtener las actividades del proyecto
      const actividades = await getActividades(projectId);
      const actividadesAgrupadas = agruparActividades(actividades);

      // Obtener los defectos de un proyecto
      const defectos = await getDefectos(projectId);
      console.log('Defectos:', defectos); // Verificar los datos de defectos

      // Título del documento
      doc.setFontSize(16);
      doc.text(`${projectName}`, 14, 22);

      // Información del proyecto
      doc.setFontSize(10);
      doc.text('Se presenta un documento en formato pdf en razón de clarificar la información obtenida del proyecto en cuestión.', 14, 30);

      // Tabla de actividades
      const actividadesTableColumn = ['Actividad', 'Minutos', 'Fecha Inicio', 'Fecha Final', 'Hora Inicio', 'Hora Final', 'Tiempo de interrupción', 'Comentarios'];
      const actividadesTableRows = [];

      actividadesAgrupadas.forEach(actividad => {
        const actividadData = [
          actividad.actividad,
          Math.round(actividad.minutos), // Redondear los minutos a un número entero
          actividad.fechaInicio,
          actividad.fechaFinal,
          actividad.horaInicio,
          actividad.horaFinal,
          Math.round(actividad.interrupcion), // Redondear el tiempo de interrupción a un número entero
          actividad.comentarios,
        ];
        actividadesTableRows.push(actividadData);
      });

      doc.autoTable({
        head: [actividadesTableColumn],
        body: actividadesTableRows,
        startY: 40,
      });

      // Obtener la última posición Y después de la tabla de actividades
      const lastY = doc.lastAutoTable.finalY;

      // Tabla de defectos
      const defectosTableColumn = [
        'Tipo de Defecto',
        'Fecha',
        'Encontrado',
        'Removido', 
        'Arreglado', 
        'Tiempo de compostura',
        'Descripción'
      ];

      const defectosTableRows = [];

      defectos.forEach(defecto => {
        const defectosData = [
          defecto.tipoError,
          defecto.fechaError,
          defecto.encontrado,
          defecto.removido,
          defecto.arreglado,
          defecto.tiempoCompostura,
          defecto.descripcionError,          
        ];
        defectosTableRows.push(defectosData);
      });

      doc.autoTable({
        head: [defectosTableColumn],
        body: defectosTableRows,
        startY: lastY + 10, // Ajusta el valor para agregar un margen entre las tablas
      });

      // Obtener la última posición Y después de la tabla de defectos
      const lastYAfterDefectos = doc.lastAutoTable.finalY;

      // Generar la gráfica de actividades
      const graficaURL = generarGraficaActividades(actividadesAgrupadas);
      console.log('URL de la gráfica:', graficaURL); // Verificar la URL de la gráfica

      // Verificar si la URL de la gráfica es válida
      if (graficaURL && graficaURL.startsWith('data:image/png;base64,')) {
        // Agregar la gráfica al PDF
        doc.addImage(graficaURL, 'PNG', 14, lastYAfterDefectos + 10, 180, 80);
      } else {
        console.error('Error al generar la URL de la gráfica');
      }

      // Guardar el PDF
      doc.save(`${projectName}.pdf`);
    }
  } catch (error) {
    console.error('Error al generar el PDF: ', error);
  }
};