import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficaActividades = ({ actividades }) => {
  const actividadesAgregadas = actividades.reduce((acc, curr) => {
    const llave = curr.actividad;
    if (!acc[llave]) {
      acc[llave] = 0;
    }
    acc[llave] += curr.minutos;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(actividadesAgregadas),
    datasets: [
      {
        label: 'Minutos por actividad',
        data: Object.values(actividadesAgregadas),
        backgroundColor: '#F71735',
      },
    ],
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <Bar data={data} />
    </div>
  );
};

GraficaActividades.propTypes = {
    actividades: PropTypes.array.isRequired,
}

export default GraficaActividades;