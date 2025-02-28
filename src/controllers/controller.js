import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, doc, deleteDoc } from 'firebase/firestore';

// Función para agregar un defecto
export const addDefecto = async (id, formData) => {
  try {
    const user = auth.currentUser;
    if (user && id) {
      const defectoData = {
        ...formData,
        tiempoCompostura: new Date().toISOString()
      };
      await addDoc(collection(db, 'usuarios', user.uid, 'proyectos', id, 'defectos'), defectoData);
      console.log('Defecto guardado correctamente en Firestore:', defectoData);
      return defectoData;
    }
  } catch (e) {
    console.error('Ha ocurrido un error al intentar agregar el documento: ', e);
    throw e;
  }
};

// Función para obtener todos los defectos
export const getDefectos = async (projectId) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const defectosQuery = query(collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'defectos'));
      const querySnapshot = await getDocs(defectosQuery);
      const defectosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return defectosData;
    }
  } catch (error) {
    console.error('Error al buscar los defectos: ', error);
    throw error;
  }
};

// Función para agregar una actividad
export const addActividad = async (projectId, actividadData) => {
  try {
    const user = auth.currentUser;
    if (user && projectId) {
      await addDoc(collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades'), actividadData);
      console.log('Actividad guardada correctamente en Firestore:', actividadData);
      return actividadData;
    }
  } catch (e) {
    console.error('Ha ocurrido un error al intentar agregar el documento: ', e);
    throw e;
  }
};

// Función para obtener todas las actividades
export const getActividades = async (projectId) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const actividadesQuery = query(collection(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades'));
      const querySnapshot = await getDocs(actividadesQuery);
      const actividadesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return actividadesData;
    }
  } catch (error) {
    console.error('Error al buscar las actividades: ', error);
    throw error;
  }
};

// Función para eliminar una actividad
export const deleteActividad = async (projectId, id) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', projectId, 'actividades', id));
      console.log('Actividad eliminada correctamente en Firestore:', id);
    }
  } catch (e) {
    console.error('Ha ocurrido un error al intentar eliminar el documento: ', e);
    throw e;
  }
};

// Función para eliminar un proyecto
export const deleteProyecto = async (id) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await deleteDoc(doc(db, 'usuarios', user.uid, 'proyectos', id));
      console.log('Proyecto eliminado correctamente en la base de datos: ', id);
    }
  } catch (e) {
    console.error('Ha ocurrido un error al intentar eliminar el proyecto: ', e);
    throw e;
  }
}