const BASE = 'http://127.0.0.1:8001/api';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const loginAdmin = async (correo: string, password: string) => {
  const res = await fetch(`${BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getStats = async () => {
  const res = await fetch(`${BASE}/stats/`, getHeaders());
  return res.json();
};

export const getUsuarios = async () => {
  const res = await fetch(`${BASE}/usuarios/`, getHeaders());
  return res.json();
};

export const getDocentes = async () => {
  const res = await fetch(`${BASE}/docentes/`, getHeaders());
  return res.json();
};

export const getSesionesAdmin = async () => {
  const res = await fetch(`${BASE}/sesiones/`, getHeaders());
  return res.json();
};

export const getPagosAdmin = async () => {
  const res = await fetch(`${BASE}/pagos/`, getHeaders());
  return res.json();
};

export const toggleUsuario = async (id: number, activo: boolean) => {
  const res = await fetch(`${BASE}/usuarios/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders().headers },
    body: JSON.stringify({ activo }),
  });
  return res.json();
};

export const verificarDocente = async (id: number, verificado: boolean) => {
  const res = await fetch(`${BASE}/docentes/${id}/verificar/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders().headers },
    body: JSON.stringify({ verificado }),
  });
  return res.json();
};