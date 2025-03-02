/* eslint-disable no-unused-vars */ 
import React from 'react';
import './Loader.css'; 

const Loader = () => { 
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="pl">
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__dot"></div>
        <div className="pl__text">Cargando...</div>
      </div>
    </div>
  );
};

export default Loader; 