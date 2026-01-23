import { supabase } from '../config/supabaseClient';
import bcrypt from 'bcryptjs';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('=== INICIANDO LOGIN ===');
      console.log('Email:', email);
      console.log('Password length:', password.length);

      // Obtener usuario de la tabla user
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

      // Validar contraseña con bcrypt
      console.log('Validando contraseña...');
      console.log('Password hash en BD:', users.password_hash);
      
      const passwordMatch = await bcrypt.compare(password, users.password_hash);
      console.log('¿Contraseña válida?:', passwordMatch);

      if (!passwordMatch) {
        throw new Error('Credenciales inválidas');
      }

      console.log('=== LOGIN EXITOSO ===');
      console.log('User data:', users);

      // Crear sesión simulada guardando en localStorage
      const sessionData = {
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
          lastname: users.lastname,
          tuition: users.tuition,
        },
        timestamp: Date.now(),
      };

      localStorage.setItem('auth_session', JSON.stringify(sessionData));
      console.log('Sesión guardada en localStorage');

      return sessionData.user;
    } catch (error) {
      console.error('=== ERROR EN LOGIN ===');
      console.error('Error completo:', error);
      console.error('Error message:', error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('=== INICIANDO LOGOUT ===');
      localStorage.removeItem('auth_session');
      console.log('Sesión eliminada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      console.log('=== VERIFICANDO AUTENTICACIÓN ===');
      const session = localStorage.getItem('auth_session');
      const isAuth = !!session;
      console.log('¿Autenticado?:', isAuth);
      return isAuth;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  getUser: async () => {
    try {
      console.log('=== OBTENIENDO USUARIO ===');
      const session = localStorage.getItem('auth_session');
      
      if (!session) {
        console.warn('No session found');
        return null;
      }

      const sessionData = JSON.parse(session);
      console.log('User data:', sessionData.user);
      return sessionData.user;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  },
};
