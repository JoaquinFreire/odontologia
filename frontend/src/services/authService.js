import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('=== INICIANDO LOGIN ===');
      console.log('Email:', email);

      const { data: users, error: userError } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)
        .single();

      console.log('User query error:', userError);
      console.log('User data:', users);

      if (userError || !users) {
        console.error('Usuario no encontrado');
        throw new Error('Credenciales inválidas');
      }

      console.log('Validando contraseña...');
      const passwordMatch = await bcrypt.compare(password, users.password_hash);
      console.log('¿Contraseña válida?:', passwordMatch);

      if (!passwordMatch) {
        throw new Error('Credenciales inválidas');
      }

      console.log('=== LOGIN EXITOSO ===');

      const userData = {
        id: users.id,
        email: users.email,
        name: users.name,
        lastname: users.lastname,
        tuition: users.tuition,
      };

      // Guardar en sessionStorage en lugar de cookies
      sessionStorage.setItem('auth_session', JSON.stringify(userData));
      console.log('Sesión guardada en sessionStorage');

      return userData;
    } catch (error) {
      console.error('=== ERROR EN LOGIN ===');
      console.error('Error:', error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('=== INICIANDO LOGOUT ===');
      console.log('SessionStorage antes:', sessionStorage.getItem('auth_session'));
      
      // Eliminar de sessionStorage
      sessionStorage.removeItem('auth_session');
      
      console.log('SessionStorage después:', sessionStorage.getItem('auth_session'));
      console.log('Sesión eliminada completamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      console.log('=== VERIFICANDO AUTENTICACIÓN ===');
      const session = sessionStorage.getItem('auth_session');
      const isAuth = !!session;
      console.log('¿Autenticado?:', isAuth);
      console.log('SessionStorage:', session);
      return isAuth;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  getUser: async () => {
    try {
      console.log('=== OBTENIENDO USUARIO ===');
      const session = sessionStorage.getItem('auth_session');
      
      if (!session) {
        console.warn('No session found');
        return null;
      }

      const user = JSON.parse(session);
      console.log('User data:', user);
      return user;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  },

  clearSession: () => {
    try {
      sessionStorage.removeItem('auth_session');
    } catch (error) {
      console.error('Error limpiando sesión:', error);
    }
  }
};
