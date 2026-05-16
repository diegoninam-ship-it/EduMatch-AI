import api from './client';
import springApi from './springboot';

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

// Django API legacy endpoints
export const getSesiones = async () => {
  const response = await api.get('/sesiones/estudiante');
  return response.data;
};

// Spring Boot API endpoints
export const getTutores = async () => {
  const response = await springApi.get('/api/tutores');
  return response.data;
};

export const getTutorById = async (id: string) => {
  const response = await springApi.get(`/api/tutores/${id}`);
  return response.data;
};

export const getTutorMaterias = async (id: string) => {
  const response = await springApi.get(`/api/tutores/${id}/materias`);
  return response.data;
};

export const getTutorDisponibilidad = async (id: string) => {
  const response = await springApi.get(`/api/tutores/${id}/disponibilidad`);
  return response.data;
};

export const getMaterias = async () => {
  const response = await springApi.get('/api/materias');
  return response.data;
};

export const getMisSesiones = async () => {
  const response = await springApi.get('/api/sesiones/mis-sesiones');
  return response.data;
};

export const crearSesion = async (datos: {
  tutorId: string;
  subjectId: string;
  availabilitySlotId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}) => {
  const studentId = localStorage.getItem('usuarioId') ?? '';
  const body = {
    student: { id: studentId },
    tutor: { id: datos.tutorId },
    subject: { id: datos.subjectId },
    availabilitySlot: { id: datos.availabilitySlotId },
    sessionDate: datos.sessionDate,
    startTime: datos.startTime,
    endTime: datos.endTime,
    notes: datos.notes ?? null,
  };
  const response = await springApi.post('/api/sesiones', body);
  return response.data;
};

export const cancelarSesion = async (id: string) => {
  const response = await springApi.patch(`/api/sesiones/${id}/estado?estado=CANCELLED`);
  return response.data;
};
