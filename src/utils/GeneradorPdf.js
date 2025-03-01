import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { auth } from '../firebaseConfig';
import { getActividades, getDefectos } from '../controllers/controller';

export const generarPDF = async (projectId) => {
  try {
    const user = auth.currentUser;
    if (user) { //Si se detecta la sesión de un usuario ==>
      const doc = new jsPDF(); //doc va a ser una nueva constante que usa la función jsPDF importada de fuera

      // Obtener las actividades del proyecto
      const actividades = await getActividades(projectId);

      // Obtener los defectos de un proyecto
      const defectos = await getDefectos(projectId);

      // Título del documento
      doc.setFontSize(16);
      doc.text('Reporte de Proyecto', 14, 22);

      // Información del proyecto
      doc.setFontSize(12);
      doc.text(`ID del proyecto: ${projectId}`, 14, 30);

      // Tabla de actividades
      const tableColumn = ['Actividad', 'Tiempo (en minutos)', 'Fecha Final', 'Hora Inicio', 'Hora Final', 'Tiempo de interrupción', 'Comentarios'];
      const tableRows = [];

      actividades.forEach(actividad => {
        const actividadData = [
          actividad.actividad,
          actividad.minutos,
          actividad.fecha,
          actividad.horaInicio,
          actividad.horaFinal,
          actividad.interrupcion,
          actividad.comentarios,
        ];
        tableRows.push(actividadData);
      });

      doc.autoTable(tableColumn, tableRows, { startY: 40 });

      // Guardar el PDF
      doc.save(`reporte_proyecto_${projectId}.pdf`);
    }
  } catch (error) {
    console.error('Error al generar el PDF: ', error);
  }
};
