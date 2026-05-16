import api from './client';
import springApi from './springboot';

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

// Spring Boot API endpoints
export const getMisSesionesDocente = async () => {
  const response = await springApi.get('/api/sesiones/mis-sesiones');
  return response.data;
};

export const cambiarEstadoSesion = async (id: string, estado: string) => {
  const response = await springApi.patch(`/api/sesiones/${id}/estado?estado=${estado}`);
  return response.data;
};
