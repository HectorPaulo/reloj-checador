/* eslint-disable no-unused-vars */
// Importa React para poder usar JSX
import React from 'react';
// Importa el componente Bar de react-chartjs-2 para crear gráficos de barras
import { Bar } from 'react-chartjs-2';
// Importa PropTypes para la validación de tipos de las props
import PropTypes from 'prop-types';

// Define el componente funcional ProjectChart que recibe 'activities' como prop
const ProjectChart = ({ activities }) => {
  // Define los datos para el gráfico de barras
  const data = {
    // Usa los nombres de las actividades como etiquetas en el eje X
    labels: activities.map(activity => activity.name),
    datasets: [
      {
        // Etiqueta del conjunto de datos
        label: 'Minutos dedicados',
        // Usa los minutos de cada actividad como datos para las barras
        data: activities.map(activity => activity.minutes),
        // Color de fondo de las barras
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Define las opciones para el gráfico
  const options = {
    scales: {
      y: {
        // Comienza el eje Y en cero
        beginAtZero: true,
      },
    },
  };

  // Renderiza el gráfico de barras dentro de un div con clase 'project-chart'
  return (
    <div className="project-chart">
      <Bar data={data} options={options} />
    </div>
  );
};

// Define los tipos de las props para el componente ProjectChart
ProjectChart.propTypes = {
  // 'activities' debe ser un array de objetos con 'name' y 'minutes'
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // 'name' debe ser una cadena y es obligatorio
      minutes: PropTypes.number.isRequired, // 'minutes' debe ser un número y es obligatorio
    })
  ).isRequired, // 'activities' es obligatorio
};

// Exporta el componente ProjectChart como el valor por defecto del módulo
export default ProjectChart;