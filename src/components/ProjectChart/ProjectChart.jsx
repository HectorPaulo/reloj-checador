/* eslint-disable no-unused-vars */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const ProjectChart = ({ activities }) => {
  const data = {
    labels: activities.map(activity => activity.name),
    datasets: [
      {
        label: 'Minutos dedicados',
        data: activities.map(activity => activity.minutes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="project-chart">
      <Bar data={data} options={options} />
    </div>
  );
};

ProjectChart.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      minutes: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProjectChart;