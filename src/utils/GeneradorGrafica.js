import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const generarGraficaActividades = (actividades) => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const actividadesAgregadas = actividades.reduce((acc, curr) => {
    const llave = curr.actividad;
    if (!acc[llave]) {
      acc[llave] = 0;
    }
    acc[llave] += curr.minutos;
    return acc;
  }, {});

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(actividadesAgregadas),
      datasets: [
        {
          label: 'Minutos por actividad',
          data: Object.values(actividadesAgregadas),
          backgroundColor: '#F71735',
        },
      ],
    },
    options: {
      responsive: false, // Asegúrate de que la gráfica no sea responsive para mantener las dimensiones
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Gráfica de Actividades',
        },
      },
    },
  });

  // Asegúrate de que la gráfica se haya renderizado antes de convertirla a URL
  chart.update();

  // Verificar el contenido del canvas
  console.log(canvas.toDataURL('image/png'));

  const dataURL = canvas.toDataURL('image/png');
  console.log('Generated Data URL:', dataURL); // Verificar la URL generada
  return dataURL;
};