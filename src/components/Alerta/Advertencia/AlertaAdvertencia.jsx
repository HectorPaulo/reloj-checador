/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const AlertaAdvertencia = ({ mensaje, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5 segundos antes de desaparecer

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-yellow-600 text-white p-4 rounded-lg shadow-lg animate-slide-in-out flex items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-grow">
          <span>{mensaje}</span>
        </div>
        <button onClick={onClose} className="ml-4 text-white text-2xl">
          &times;
        </button>
      </div>
    </div>
  );
};

AlertaAdvertencia.propTypes = {
  mensaje: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertaAdvertencia;
