export const agruparActividades = (actividades) => {
  const actividadesAgrupadas = actividades.reduce((acc, curr) => {
    const llave = curr.actividad;
    if (!acc[llave]) {
      acc[llave] = {
        actividad: curr.actividad,
        minutos: 0,
        interrupcion: 0,
        fechaInicio: curr.fecha,
        fechaFinal: curr.fecha,
        horaInicio: curr.horaInicio,
        horaFinal: curr.horaFinal,
        comentarios: curr.comentarios,
      };
    }
    acc[llave].minutos += curr.minutos;
    acc[llave].interrupcion += curr.interrupcion;
    acc[llave].fechaFinal = curr.fecha;
    acc[llave].horaInicio = curr.horaInicio;
    acc[llave].horaFinal = curr.horaFinal;
    acc[llave].comentarios = curr.comentarios;
    return acc;
  }, {});

  return Object.values(actividadesAgrupadas);
};