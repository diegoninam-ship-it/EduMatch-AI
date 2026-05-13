import api from './client';

export const getPerfil = async () => {
  const response = await api.get('/student-profiles/me/');
  return response.data;
};

export const actualizarPerfil = async (datos: any) => {
  const response = await api.put('/student-profiles/me/', datos);
  return response.data;
};

export const getRutaActiva = async () => {
  const response = await api.get('/learning-routes/');
  return response.data;
};

export const getModulos = async (rutaId: number) => {
  const response = await api.get(`/learning-routes/${rutaId}/`);
  return response.data;
};

export const completarModulo = async (moduloId: number) => {
  const response = await api.put(`/learning-routes/${moduloId}/completar/`);
  return response.data;
};

export const getSesiones = async () => {
  const response = await api.get('/sesiones/estudiante');
  return response.data;
};
