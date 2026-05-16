// Un solo backend: Django REST Framework en :8000/api/v1
const BASE_V1 = 'http://127.0.0.1:8000/api/v1';

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
});

// ── Auth ──────────────────────────────────────────────────────────────────

export const loginAdmin = async (correo: string, password: string) => {
  const res = await fetch(`${BASE_V1}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? JSON.stringify(data));
  return data;
};

// ── Stats (construido desde los endpoints reales) ─────────────────────────

export const getStats = async () => {
  const [usersRes, tutorsRes, sessionsRes] = await Promise.allSettled([
    fetch(`${BASE_V1}/users/`,    { headers: jsonHeaders() }).then(r => r.ok ? r.json() : []),
    fetch(`${BASE_V1}/tutors/`,   { headers: jsonHeaders() }).then(r => r.ok ? r.json() : []),
    fetch(`${BASE_V1}/sessions/`, { headers: jsonHeaders() }).then(r => r.ok ? r.json() : []),
  ]);

  const users    = usersRes.status    === 'fulfilled' && Array.isArray(usersRes.value)    ? usersRes.value    : [];
  const tutors   = tutorsRes.status   === 'fulfilled' && Array.isArray(tutorsRes.value)   ? tutorsRes.value   : [];
  const sessions = sessionsRes.status === 'fulfilled' && Array.isArray(sessionsRes.value) ? sessionsRes.value : [];

  const today = new Date().toISOString().split('T')[0];

  return {
    totalUsuarios:       users.length,
    totalEstudiantes:    users.filter((u: any) => u.role_name === 'STUDENT').length,
    totalDocentes:       tutors.length,
    docentesVerificados: tutors.filter((t: any) => t.is_available).length,
    totalSesiones:       sessions.length,
    sesionesHoy:         sessions.filter((s: any) => s.session_date === today).length,
    ingresoMes:          0,
  };
};

// ── Usuarios ──────────────────────────────────────────────────────────────

export const getUsuarios = async () => {
  const res = await fetch(`${BASE_V1}/users/`, { headers: jsonHeaders() });
  return res.json();
};

// El endpoint toggle-status no necesita cuerpo — alterna is_active internamente
export const toggleUsuario = async (id: number, _activo?: boolean) => {
  const res = await fetch(`${BASE_V1}/users/${id}/toggle-status/`, {
    method: 'PATCH',
    headers: jsonHeaders(),
  });
  return res.json();
};

// ── Tutores ───────────────────────────────────────────────────────────────

export const getDocentes = async () => {
  const res = await fetch(`${BASE_V1}/tutors/`, { headers: jsonHeaders() });
  return res.json();
};

export const verificarDocente = async (id: number, verificado: boolean) => {
  const res = await fetch(`${BASE_V1}/tutors/${id}/`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify({ is_available: verificado }),
  });
  return res.json();
};

// ── Sesiones ──────────────────────────────────────────────────────────────

export const getSesionesAdmin = async () => {
  const res = await fetch(`${BASE_V1}/sessions/`, { headers: jsonHeaders() });
  return res.json();
};

// ── Pagos (sin endpoint en el backend; devuelve vacío para que la UI use mock) ──

export const getPagosAdmin = async (): Promise<any[]> => {
  return [];
};

// ── Tutores CRUD ──────────────────────────────────────────────────────────

export const getTutoresV1 = getDocentes;

export const registrarUsuarioTutor = async (datos: {
  nombre: string; correo: string; password: string; password_confirm: string;
}) => {
  const res = await fetch(`${BASE_V1}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...datos, rol: 'TUTOR' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data as { user: { id: string; email: string; first_name: string; last_name: string } };
};

export const crearTutor = async (datos: {
  user: string; biography: string; experience_years: number; hourly_rate: number; is_available: boolean;
}) => {
  const res = await fetch(`${BASE_V1}/tutors/`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(datos),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

export const actualizarTutor = async (id: number | string, datos: Record<string, unknown>) => {
  const res = await fetch(`${BASE_V1}/tutors/${id}/`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

export const eliminarTutor = async (id: number | string) => {
  const res = await fetch(`${BASE_V1}/tutors/${id}/`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(`${res.status}`);
};

// ── Materias CRUD ─────────────────────────────────────────────────────────

export const getMateriasAdmin = async () => {
  const res = await fetch(`${BASE_V1}/subjects/`, { headers: jsonHeaders() });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

export const crearMateria = async (datos: { name: string; description: string }) => {
  const res = await fetch(`${BASE_V1}/subjects/`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ is_active: true, ...datos }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

export const actualizarMateria = async (id: number | string, datos: Record<string, unknown>) => {
  const res = await fetch(`${BASE_V1}/subjects/${id}/`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

export const eliminarMateria = async (id: number | string) => {
  const res = await fetch(`${BASE_V1}/subjects/${id}/`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(`${res.status}`);
};

// ── Módulos CRUD (mostrados como "temas" en la UI) ────────────────────────

export const getModulosAdmin = async () => {
  const res = await fetch(`${BASE_V1}/modules/`, { headers: jsonHeaders() });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

export const crearModulo = async (datos: {
  subject: number | string; title: string; description: string; order?: number;
}) => {
  const res = await fetch(`${BASE_V1}/modules/`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ order: 1, ...datos }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

export const actualizarModulo = async (id: number | string, datos: Record<string, unknown>) => {
  const res = await fetch(`${BASE_V1}/modules/${id}/`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
};

export const eliminarModulo = async (id: number | string) => {
  const res = await fetch(`${BASE_V1}/modules/${id}/`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  if (!res.ok) throw new Error(`${res.status}`);
};
