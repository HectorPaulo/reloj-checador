/* eslint-disable no-unused-vars */
import React from 'react';
import Footer from '../Footer/Footer';
import NavBar from '../Navbar/Navbar';

const Dashboard = () => {
const irAProyectos = () => {
    window.location.href = '/proyectos';
};

return (
    <div className="flex flex-col items-center min-h-screen">
        <div className="w-full">
            <NavBar />
        </div>
        <div className="flex-grow container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center my-8">Dashboard</h1>
            <p className="text-xl text-center mb-8">Bienvenido al Dashboard. Aquí puedes gestionar tus proyectos y actividades.</p>
            <div className="flex justify-center">
                <button 
                className='w-50 border p-4 rounded-lg bg-transparent font-semibold hover:bg-white hover:text-black hover:scale-115 cursor-pointer'
                onClick={irAProyectos}
                >
                    Proyectos
                </button>
            </div>
        </div>
        <Footer />
    </div>
);
};

export default Dashboard;