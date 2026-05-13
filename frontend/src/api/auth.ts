import api from './client';

export const login = async (correo: string, password: string) => {
  const response = await api.post('/auth/login/', { correo, password });
  
  const data = response.data;
  
  // Guardar datos en localStorage
  localStorage.setItem('token', data.access);
  localStorage.setItem('refresh', data.refresh);
  localStorage.setItem('usuario', JSON.stringify(data.user));
  localStorage.setItem('usuarioId', data.user.id);
  localStorage.setItem('nombre', `${data.user.first_name} ${data.user.last_name}`);
  localStorage.setItem('rol', data.user.role.name);
  
  return data;
};

export const register = async (nombre: string, correo: string,
                                password: string, password_confirm: string,
                                rol: string = 'STUDENT') => {
  const response = await api.post('/auth/register/', {
    nombre, correo, password, password_confirm, rol
  });
  
  const data = response.data;
  
  // Guardar datos en localStorage
  localStorage.setItem('token', data.access);
  localStorage.setItem('refresh', data.refresh);
  localStorage.setItem('usuario', JSON.stringify(data.user));
  localStorage.setItem('usuarioId', data.user.id);
  localStorage.setItem('nombre', `${data.user.first_name} ${data.user.last_name}`);
  localStorage.setItem('rol', data.user.role.name);
  
  return data;
};

export const logout = async () => {
  try {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      await api.post('/auth/logout/', { refresh });
    }
  } catch {
    // Si falla el servidor igual limpiamos localmente
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuario');
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getRol = () => {
  return localStorage.getItem('rol');
};