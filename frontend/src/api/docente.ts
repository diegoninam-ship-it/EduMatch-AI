import api from './client';

export const getPerfilDocente = async () => {
  const response = await api.get('/docente/perfil');
  return response.data;
};

export const actualizarPerfilDocente = async (datos: any) => {
  const response = await api.put('/docente/perfil', datos);
  return response.data;
};

export const getSesionesDocente = async () => {
  const response = await api.get('/sesiones/docente');
  return response.data;
};

export const getDisponibilidad = async () => {
  const response = await api.get('/disponibilidad');
  return response.data;
};

export const agregarDisponibilidad = async (datos: any) => {
  const response = await api.post('/disponibilidad', datos);
  return response.data;
};

export const eliminarDisponibilidad = async (id: number) => {
  await api.delete(`/disponibilidad/${id}`);
};