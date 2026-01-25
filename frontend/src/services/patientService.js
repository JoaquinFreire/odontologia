import { supabase } from '../config/supabaseClient';

// Guardar o actualizar un paciente
export const savePatient = async (patientData) => {
  try {
    const dataToSave = {
      name: patientData.name,
      lastname: patientData.lastname,
      dni: patientData.dni || '',
      birthdate: patientData.birthDate || '',
      tel: patientData.phone || '',
      email: patientData.email || '',
      address: patientData.address || '',
      occupation: patientData.occupation || '',
      affiliate_number: patientData.healthInsurance?.number || '',
      holder: patientData.healthInsurance?.isHolder || false
    };

    if (patientData.patientId) {
      const { data, error } = await supabase
        .from('patient')
        .update(dataToSave)
        .eq('id', patientData.patientId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0], isNew: false };
    } else {
      const { data, error } = await supabase
        .from('patient')
        .insert([dataToSave])
        .select();

      if (error) throw error;
      return { success: true, data: data[0], isNew: true };
    }
  } catch (error) {
    console.error('Error al guardar paciente:', error);
    return { success: false, error: error.message };
  }
};

// Obtener un paciente por ID (filtrar por user_id)
export const getPatient = async (patientId, userId) => {
  try {
    const { data, error } = await supabase
      .from('patient')
      .select('*')
      .eq('id', patientId)
      .eq('user_id', userId) // ← Filtrar por usuario
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return { success: false, error: error.message };
  }
};

// Guardar paciente completo (paciente + anamnesis)
export const saveCompletePatient = async (patientData, anamnesisData, userId) => {
  try {
    // Validar datos del paciente
    if (!patientData.name || !patientData.lastname || !patientData.dni) {
      return { 
        success: false, 
        error: 'Nombre, Apellido y DNI son requeridos' 
      };
    }

    // Validar que al menos una enfermedad esté marcada
    const hasAnyDisease = Object.values(anamnesisData.diseases).some(value => value === true);
    if (!hasAnyDisease) {
      return { 
        success: false, 
        error: 'Debe marcar al menos una condición en la anamnesis' 
      };
    }

    // 1. Guardar paciente con user_id
    const { data: patientDataSaved, error: patientError } = await supabase
      .from('patient')
      .insert([
        {
          name: patientData.name,
          lastname: patientData.lastname,
          dni: patientData.dni,
          birthdate: patientData.birthDate || null,
          tel: patientData.phone || '',
          email: patientData.email || '',
          address: patientData.address || '',
          occupation: patientData.occupation || '',
          affiliate_number: patientData.healthInsurance?.number || '',
          holder: patientData.healthInsurance?.isHolder || false,
          user_id: userId // ← Agregar user_id
        }
      ])
      .select();

    if (patientError) throw patientError;

    const newPatientId = patientDataSaved[0].id;

    // 2. Preparar datos de anamnesis
    const anamnesisPayload = {
      patient_id: newPatientId,
      alergico: anamnesisData.allergies.hasAllergies || false,
      medico_cabecera: anamnesisData.primaryDoctor || null,
      medico_tel: anamnesisData.primaryDoctorPhone || null,
      'servicio cabecera': anamnesisData.primaryService || null,
      alergias_descripcion: anamnesisData.allergies.description || null,
      tratamiento_medico: anamnesisData.currentTreatment.underTreatment || false,
      hospitalizado_ultimo_anio: anamnesisData.hospitalization.wasHospitalized || false,
      hospitalizacion_motivo: anamnesisData.hospitalization.reason || null,
      problemas_cicatrizacion: anamnesisData.healingProblems || false,
      grupo_sanguineo: anamnesisData.bloodType || null,
      rh: anamnesisData.bloodRh || null,
      embarazada: anamnesisData.isPregnant || false,
      tiempo_gestacional: anamnesisData.pregnancyTime || null,
      obstetra: anamnesisData.obstetrician || null,
      obstetra_tel: anamnesisData.obstetricianPhone || null,
      medicamento: anamnesisData.takesMedication || false,
      medicamento_detalles: anamnesisData.medication || null,
      antecedentes: anamnesisData.diseases
    };

    // 3. Guardar anamnesis
    const { data: anamnesisDataSaved, error: anamnesisError } = await supabase
      .from('anamnesis_answers')
      .insert([anamnesisPayload])
      .select();

    if (anamnesisError) throw anamnesisError;

    return { 
      success: true, 
      patient: patientDataSaved[0],
      anamnesis: anamnesisDataSaved[0],
      message: `Paciente ${patientDataSaved[0].name} ${patientDataSaved[0].lastname} guardado exitosamente con su historia clínica`
    };
  } catch (error) {
    console.error('Error saving complete patient:', error);
    return { success: false, error: error.message };
  }
};

// Obtener paciente con su anamnesis (filtrar por user_id)
export const getPatientWithAnamnesis = async (patientId, userId) => {
  try {
    const { data: patient, error: patientError } = await supabase
      .from('patient')
      .select('*')
      .eq('id', patientId)
      .eq('user_id', userId) // ← Filtrar por usuario
      .single();

    if (patientError) throw patientError;

    const { data: anamnesis, error: anamnesisError } = await supabase
      .from('anamnesis_answers')
      .select('*')
      .eq('patient_id', patientId)
      .single();

    if (anamnesisError && anamnesisError.code !== 'PGRST116') throw anamnesisError;

    return { 
      success: true, 
      patient,
      anamnesis: anamnesis || null
    };
  } catch (error) {
    console.error('Error fetching patient with anamnesis:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar anamnesis existente
export const updatePatientAnamnesis = async (patientId, anamnesisData) => {
  try {
    const anamnesisPayload = {
      alergico: anamnesisData.allergies.hasAllergies || false,
      medico_cabecera: anamnesisData.primaryDoctor || null,
      medico_tel: anamnesisData.primaryDoctorPhone || null,
      'servicio cabecera': anamnesisData.primaryService || null,
      alergias_descripcion: anamnesisData.allergies.description || null,
      tratamiento_medico: anamnesisData.currentTreatment.underTreatment || false,
      hospitalizado_ultimo_anio: anamnesisData.hospitalization.wasHospitalized || false,
      hospitalizacion_motivo: anamnesisData.hospitalization.reason || null,
      problemas_cicatrizacion: anamnesisData.healingProblems || false,
      grupo_sanguineo: anamnesisData.bloodType || null,
      rh: anamnesisData.bloodRh || null,
      embarazada: anamnesisData.isPregnant || false,
      tiempo_gestacional: anamnesisData.pregnancyTime || null,
      obstetra: anamnesisData.obstetrician || null,
      obstetra_tel: anamnesisData.obstetricianPhone || null,
      medicamento: anamnesisData.takesMedication || false,
      medicamento_detalles: anamnesisData.medication || null,
      antecedentes: anamnesisData.diseases
    };

    const { data, error } = await supabase
      .from('anamnesis_answers')
      .update(anamnesisPayload)
      .eq('patient_id', patientId)
      .select();

    if (error) throw error;

    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating anamnesis:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todos los pacientes del usuario actual
export const getAllPatients = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('patient')
      .select('*')
      .eq('user_id', userId) // ← Filtrar por usuario
      .order('id', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return { success: false, error: error.message };
  }
};
