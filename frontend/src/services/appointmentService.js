import { supabase } from '../config/supabaseClient';

export const appointmentService = {
  // Obtener turnos de hoy
  getTodayAppointments: async () => {
    try {
      console.log('=== OBTENIENDO TURNOS DE HOY ===');
      
      // Obtener fecha de hoy
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      console.log('Fecha inicio:', startOfDay.toISOString());
      console.log('Fecha fin:', endOfDay.toISOString());

      const { data, error } = await supabase
        .from('shift')
        .select('*')
        .gte('datetime', startOfDay.toISOString())
        .lt('datetime', endOfDay.toISOString())
        .eq('status', false)  // Solo los pendientes
        .order('datetime', { ascending: true });

      console.log('Query error:', error);
      console.log('Today appointments:', data);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo turnos de hoy:', error);
      return [];
    }
  },

  // Obtener turnos atrasados
  getOverdueAppointments: async () => {
    try {
      console.log('=== OBTENIENDO TURNOS ATRASADOS ===');
      
      // Obtener turnos pendientes anteriores a hoy
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      console.log('Fecha límite:', startOfDay.toISOString());

      const { data, error } = await supabase
        .from('shift')
        .select('*')
        .lt('datetime', startOfDay.toISOString())
        .eq('status', false)  // Solo los pendientes
        .order('datetime', { ascending: false });

      console.log('Query error:', error);
      console.log('Overdue appointments:', data);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo turnos atrasados:', error);
      return [];
    }
  },

  // Obtener total de turnos pendientes
  getTotalPendingAppointments: async () => {
    try {
      console.log('=== OBTENIENDO TOTAL DE TURNOS PENDIENTES ===');

      const { count, error } = await supabase
        .from('shift')
        .select('*', { count: 'exact' })
        .eq('status', false);

      console.log('Query error:', error);
      console.log('Total pending:', count);

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    } catch (error) {
      console.error('Error obteniendo total de turnos pendientes:', error);
      return 0;
    }
  },

  // Marcar turno como atendido
  markAppointmentAsCompleted: async (id) => {
    try {
      console.log('=== MARCANDO TURNO COMO ATENDIDO ===');
      console.log('ID:', id);

      const { data, error } = await supabase
        .from('shift')
        .update({ status: true })
        .eq('id', id)
        .select();

      console.log('Update error:', error);
      console.log('Updated appointment:', data);

      if (error) {
        throw new Error(error.message);
      }

      console.log('=== TURNO MARCADO COMO ATENDIDO ===');
      return data[0];
    } catch (error) {
      console.error('Error marcando turno como atendido:', error);
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      console.log('=== CREANDO TURNO ===');
      console.log('Datos del turno:', appointmentData);

      const dateTimeString = `${appointmentData.date}T${appointmentData.time}:00`;
      const datetime = new Date(dateTimeString).toISOString();

      console.log('DateTime formateado:', datetime);

      const dataToInsert = {
        name: appointmentData.name,
        datetime: datetime,
        dni: appointmentData.dni || null,
        type: appointmentData.type,
        status: false, // Por defecto sin atender
      };

      console.log('Datos a insertar:', dataToInsert);

      const { data, error } = await supabase
        .from('shift')
        .insert([dataToInsert])
        .select();

      console.log('Insert error:', error);
      console.log('Insert data:', data);

      if (error) {
        console.error('Error al crear turno:', error.message);
        throw new Error(error.message || 'Error al crear turno');
      }

      console.log('=== TURNO CREADO EXITOSAMENTE ===');
      console.log('Turno data:', data);

      return data[0];
    } catch (error) {
      console.error('=== ERROR EN createAppointment ===');
      console.error('Error completo:', error);
      console.error('Error message:', error.message);
      throw error;
    }
  },

  getAppointments: async () => {
    try {
      console.log('=== OBTENIENDO TURNOS ===');

      const { data, error } = await supabase
        .from('shift')
        .select('*')
        .order('datetime', { ascending: true });

      console.log('Query error:', error);
      console.log('Turnos data:', data);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo turnos:', error);
      return [];
    }
  },

  getAppointmentById: async (id) => {
    try {
      console.log('=== OBTENIENDO TURNO POR ID ===');
      console.log('ID:', id);

      const { data, error } = await supabase
        .from('shift')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Query error:', error);
      console.log('Turno data:', data);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo turno:', error);
      return null;
    }
  },

  updateAppointment: async (id, appointmentData) => {
    try {
      console.log('=== ACTUALIZANDO TURNO ===');
      console.log('ID:', id);
      console.log('Datos:', appointmentData);

      const dataToUpdate = {};

      if (appointmentData.name) dataToUpdate.name = appointmentData.name;
      if (appointmentData.date && appointmentData.time) {
        const dateTimeString = `${appointmentData.date}T${appointmentData.time}:00`;
        dataToUpdate.datetime = new Date(dateTimeString).toISOString();
      }
      if (appointmentData.dni !== undefined) dataToUpdate.dni = appointmentData.dni;
      if (appointmentData.type) dataToUpdate.type = appointmentData.type;

      const { data, error } = await supabase
        .from('shift')
        .update(dataToUpdate)
        .eq('id', id)
        .select();

      console.log('Update error:', error);
      console.log('Update data:', data);

      if (error) {
        throw new Error(error.message);
      }

      console.log('=== TURNO ACTUALIZADO EXITOSAMENTE ===');
      return data[0];
    } catch (error) {
      console.error('Error actualizando turno:', error);
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      console.log('=== ELIMINANDO TURNO ===');
      console.log('ID:', id);

      const { error } = await supabase
        .from('shift')
        .delete()
        .eq('id', id);

      console.log('Delete error:', error);

      if (error) {
        throw new Error(error.message);
      }

      console.log('=== TURNO ELIMINADO EXITOSAMENTE ===');
      return true;
    } catch (error) {
      console.error('Error eliminando turno:', error);
      throw error;
    }
  },
};
