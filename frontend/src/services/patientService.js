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

// Guardar paciente completo (paciente + anamnesis + consentimiento + odontograma)
export const saveCompletePatient = async (patientData, anamnesisData, consentData, odontogramaData, userId) => {
  try {
    console.log('=== INICIANDO GUARDADO ===');
    
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

    // Validar consentimiento
    if (!consentData?.accepted) {
      return {
        success: false,
        error: 'Debe aceptar el consentimiento informado'
      };
    }

    // 1. Guardar paciente con user_id
    console.log('Guardando paciente...');
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
          user_id: userId
        }
      ])
      .select();

    if (patientError) throw patientError;

    const newPatientId = patientDataSaved[0].id;
    console.log('Paciente guardado con ID:', newPatientId);

    // 2. Guardar anamnesis CON observaciones
    console.log('Guardando anamnesis...');
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
      antecedentes: anamnesisData.diseases,
      observaciones: anamnesisData.observations || null
    };

    const { data: anamnesisDataSaved, error: anamnesisError } = await supabase
      .from('anamnesis_answers')
      .insert([anamnesisPayload])
      .select();

    if (anamnesisError) throw anamnesisError;
    console.log('Anamnesis guardada');

    // 3. Guardar consentimiento CON datos completos
    console.log('Guardando consentimiento...');
    const consentPayload = {
      patient_id: newPatientId,
      text: `En este acto, yo ${patientData.name} ${patientData.lastname} DNI ${patientData.dni} autorizo a Od ${consentData.doctorName || 'No especificado'} M.P. ${consentData.doctorMatricula || 'No especificada'} y/o asociados o ayudantes a realizar el tratamiento informado, conversado con el profesional sobre la naturaleza y propósito del tratamiento, sobre la posibilidad de complicaciones, los riesgos y administración de anestesia local, práctica, radiografías y otros métodos de diagnóstico.`,
      datetime: consentData.datetime || new Date().toISOString(),
      accepted: consentData.accepted || false
    };

    console.log('Payload del consentimiento:', consentPayload);

    const { data: consentDataSaved, error: consentError } = await supabase
      .from('consent')
      .insert([consentPayload])
      .select();

    if (consentError) throw consentError;
    console.log('Consentimiento guardado');

    // 4. Guardar odontograma
    console.log('Guardando odontograma...');
    const odontogramaPayload = {
      patient_id: newPatientId,
      formato: JSON.stringify(odontogramaData)
    };

    const { data: odontogramaDataSaved, error: odontogramaError } = await supabase
      .from('odontograma')
      .insert([odontogramaPayload])
      .select();

    if (odontogramaError) throw odontogramaError;
    console.log('Odontograma guardado');

    return { 
      success: true, 
      patient: patientDataSaved[0],
      anamnesis: anamnesisDataSaved[0],
      consent: consentDataSaved[0],
      odontograma: odontogramaDataSaved[0],
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

// Obtener todos los pacientes del usuario actual CON PAGINACIÓN
export const getAllPatients = async (userId, page = 1, pageSize = 10) => {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Obtener el total de pacientes
    const { count, error: countError } = await supabase
      .from('patient')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw countError;

    // Obtener los pacientes de la página actual
    const { data, error } = await supabase
      .from('patient')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const totalPages = Math.ceil(count / pageSize);

    return { 
      success: true, 
      data,
      pagination: {
        currentPage: page,
        pageSize,
        totalPatients: count,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    return { success: false, error: error.message };
  }
};

// Función auxiliar para calcular edad
export const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
