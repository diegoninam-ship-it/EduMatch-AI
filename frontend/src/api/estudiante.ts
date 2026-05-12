import api from './client';

export const getPerfil = async () => {
  const response = await api.get('/estudiante/perfil');
  return response.data;
};

export const actualizarPerfil = async (datos: any) => {
  const response = await api.put('/estudiante/perfil', datos);
  return response.data;
};

export const getRutaActiva = async () => {
  const response = await api.get('/ruta/activa');
  return response.data;
};

export const getModulos = async (rutaId: number) => {
  const response = await api.get(`/ruta/${rutaId}/modulos`);
  return response.data;
};

export const completarModulo = async (moduloId: number) => {
  const response = await api.put(`/ruta/modulos/${moduloId}/completar`);
  return response.data;
};

export const getSesiones = async () => {
  const response = await api.get('/sesiones/estudiante');
  return response.data;
};