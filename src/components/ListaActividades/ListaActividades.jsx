/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import EditarModal from '../Modales/Editar/Editar';

const ListaActividades = () => {
    const [actividades, setActividades] = useState([]);
    const [editarModalIsOpen, setEditarModalIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'actividades'));
                const actividadesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setActividades(actividadesData);
            } catch (error) {
                console.error('Error al buscar las actividades: ', error);
            }
        };
        fetchActivities();
    }, []);

    const handleDelete = useCallback(async (id) => {
        try {
            await deleteDoc(doc(db, 'actividades', id));
            const querySnapshot = await getDocs(collection(db, 'actividades'));
            const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActividades(activitiesData);
        } catch (e) {
            console.error('Ha ocurrido un error al intentar eliminar el documento: ', e);
        }
    }, []);

    const handleEdit = useCallback((activity) => {
        setSelectedActivity(activity);
        setInputValue(activity.actividad);
        setEditarModalIsOpen(true);
    }, []);

    const handleEditSubmit = useCallback(async () => {
        try {
            const activityRef = doc(db, 'actividades', selectedActivity.id);
            await updateDoc(activityRef, { actividad: inputValue });
            const querySnapshot = await getDocs(collection(db, 'actividades'));
            const activitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActividades(activitiesData);
        } catch (e) {
            console.error('Ha ocurrido un error al intentar actualizar el documento: ', e);
        }
        setEditarModalIsOpen(false);
        setInputValue('');
    }, [inputValue, selectedActivity]);

    return (
        <div className='flex flex-col items-center min-h-screen'>
            <div className='w-full'>
                <NavBar />
            </div>
            <h1 className='font-bold text-6xl font-sans text-center my-12'>Lista de Actividades</h1>
            <ul className='w-100 max-w-2xl mx-auto'>
                {actividades.map((activity) => (
                    <li key={activity.id} className='flex justify-between items-center p-2 border-b'>
                        <span>{activity.actividad}</span>
                        <div>
                            <button className='cursor-pointer hover:scale-110 mx-4' onClick={() => handleEdit(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                            <button className='cursor-pointer hover:scale-110 mx-4' onClick={() => handleDelete(activity.id)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                        </div>
                    </li>
                ))}
            </ul>
            <EditarModal
                isOpen={editarModalIsOpen}
                onRequestClose={() => setEditarModalIsOpen(false)}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleEditSubmit={handleEditSubmit}
            />
            <footer className='mt-auto w-full'>
                <Footer />
            </footer>
        </div>
    );
};

export default ListaActividades;
