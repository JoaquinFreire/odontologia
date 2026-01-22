const API_URL = 'http://localhost:5057'; // ENV 

export const authService = {
  login: async (email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluye las cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.message || 'Credenciales inválidas');
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
          throw new Error('Error al iniciar sesión');
        }
      }

      try {
        const data = await response.json();
        return data;
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Si no hay JSON válido pero la respuesta fue ok, retornar éxito
        return { message: 'Login exitoso' };
      }
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Error en logout');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  checkAuth: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      
      console.log('checkAuth response status:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },
};
