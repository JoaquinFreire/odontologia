import React, { useState, useMemo, useCallback } from 'react';
import '../styles/ViewPatient.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchPatients from '../components/SearchPatients';
import PatientsTable from '../components/PatientsTable';
import PaginationControls from '../components/PaginationControls';

// Iconos como componentes de React (FUERA del componente)
const UserIcon = () => <span className="icon">👤</span>;
const CalendarIcon = () => <span className="icon">📅</span>;
const FileIcon = () => <span className="icon">📄</span>;
const CloseIcon = () => <span className="icon">✕</span>;

// Datos fuera del componente - Más datos de prueba
const MOCK_PATIENTS = [
    {
        id: 1,
        dni: '30568974',
        name: 'María González',
        age: 35,
        gender: 'Femenino',
        phone: '351-456-7890',
        email: 'maria.gonzalez@email.com',
        address: 'Av. Colón 1234, Córdoba',
        bloodType: 'O+',
        lastVisit: '2024-01-15',
        nextAppointment: '2024-02-20',
    },
    {
        id: 2,
        dni: '28956321',
        name: 'Carlos Rodríguez',
        age: 42,
        gender: 'Masculino',
        phone: '351-789-1234',
        email: 'carlos.rodriguez@email.com',
        address: 'San Martín 567, Córdoba',
        bloodType: 'A-',
        lastVisit: '2024-01-10',
        nextAppointment: '2024-02-25',
    },
    {
        id: 3,
        dni: '33458712',
        name: 'Ana Martínez',
        age: 28,
        gender: 'Femenino',
        phone: '351-234-5678',
        email: 'ana.martinez@email.com',
        address: 'Belgrano 890, Córdoba',
        bloodType: 'B+',
        lastVisit: '2023-12-20',
        nextAppointment: null,
    },
    {
        id: 4,
        dni: '29745863',
        name: 'Juan López',
        age: 55,
        gender: 'Masculino',
        phone: '351-321-6547',
        email: 'juan.lopez@email.com',
        address: 'Rivadavia 456, Córdoba',
        bloodType: 'AB+',
        lastVisit: '2023-11-30',
        nextAppointment: '2024-03-10',
    },
    {
        id: 5,
        dni: '32847596',
        name: 'Laura García',
        age: 31,
        gender: 'Femenino',
        phone: '351-654-9870',
        email: 'laura.garcia@email.com',
        address: 'Ayacucho 789, Córdoba',
        bloodType: 'O-',
        lastVisit: '2024-01-05',
        nextAppointment: '2024-02-28',
    },
    {
        id: 6,
        dni: '27563941',
        name: 'Roberto Fernández',
        age: 48,
        gender: 'Masculino',
        phone: '351-147-2589',
        email: 'roberto.fernandez@email.com',
        address: 'Ituzaingó 321, Córdoba',
        bloodType: 'B-',
        lastVisit: '2023-12-15',
        nextAppointment: null,
    },
    {
        id: 7,
        dni: '34129873',
        name: 'Sofía Menéndez',
        age: 26,
        gender: 'Femenino',
        phone: '351-789-4561',
        email: 'sofia.menendez@email.com',
        address: 'Vélez Sársfield 654, Córdoba',
        bloodType: 'A+',
        lastVisit: '2024-01-12',
        nextAppointment: '2024-03-05',
    },
    {
        id: 8,
        dni: '31746258',
        name: 'Miguel Díaz',
        age: 39,
        gender: 'Masculino',
        phone: '351-456-1234',
        email: 'miguel.diaz@email.com',
        address: 'Hipólito Yrigoyen 987, Córdoba',
        bloodType: 'AB-',
        lastVisit: '2024-01-08',
        nextAppointment: '2024-02-15',
    },
    {
        id: 9,
        dni: '30195847',
        name: 'Patricia Rojas',
        age: 52,
        gender: 'Femenino',
        phone: '351-258-9630',
        email: 'patricia.rojas@email.com',
        address: 'Dorrego 147, Córdoba',
        bloodType: 'O+',
        lastVisit: '2023-12-28',
        nextAppointment: null,
    },
    {
        id: 10,
        dni: '32458967',
        name: 'David Ortiz',
        age: 44,
        gender: 'Masculino',
        phone: '351-369-2580',
        email: 'david.ortiz@email.com',
        address: 'Castro Barros 258, Córdoba',
        bloodType: 'A-',
        lastVisit: '2024-01-02',
        nextAppointment: '2024-03-15',
    },
    {
        id: 11,
        dni: '31625439',
        name: 'Elena Suárez',
        age: 36,
        gender: 'Femenino',
        phone: '351-741-8529',
        email: 'elena.suarez@email.com',
        address: 'Pringles 369, Córdoba',
        bloodType: 'B+',
        lastVisit: '2023-11-20',
        nextAppointment: '2024-02-10',
    },
    {
        id: 12,
        dni: '29834756',
        name: 'Francisco Peña',
        age: 51,
        gender: 'Masculino',
        phone: '351-852-9630',
        email: 'francisco.pena@email.com',
        address: 'Bolívar 741, Córdoba',
        bloodType: 'AB+',
        lastVisit: '2023-12-05',
        nextAppointment: null,
    },
];

const ViewPatient = ({ setIsAuthenticated, user, setUser }) => {
    // Estado para pacientes
    const [patients, setPatients] = useState(MOCK_PATIENTS);

    // Estado para búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Estado para modales
    const [showMedicalHistoryModal, setShowMedicalHistoryModal] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showPatientDetails, setShowPatientDetails] = useState(false);

    // Estado para paciente seleccionado
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Estado para nuevo turno
    const [newAppointment, setNewAppointment] = useState({
        date: '',
        time: '',
        reason: 'Consulta general',
        doctor: 'Dr. García',
        notes: ''
    });

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(5);
    const [activeNav, setActiveNav] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    // Crear nuevo turno con useCallback para estabilizar la referencia
    const handleCreateAppointment = useCallback(() => {
        if (!newAppointment.date || !newAppointment.time) {
            alert('Por favor, complete fecha y hora');
            return;
        }

        // Aquí iría la lógica para guardar el turno en la API
        alert(`Turno agendado para ${selectedPatient.name} el ${newAppointment.date} a las ${newAppointment.time}`);

        // Actualizar paciente con nuevo turno
        setPatients(prevPatients =>
            prevPatients.map(p =>
                p.id === selectedPatient.id
                    ? { ...p, nextAppointment: `${newAppointment.date} ${newAppointment.time}` }
                    : p
            )
        );

        setShowAppointmentModal(false);
        setNewAppointment({
            date: '',
            time: '',
            reason: '',
            doctor: '',
            notes: ''
        });
    }, [newAppointment, selectedPatient]);


    // Manejar búsqueda
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Volver a la primera página al buscar
    };
    
    // Detectar automáticamente si es DNI o nombre
    const detectSearchType = () => {
        if (!searchTerm.trim()) return null;
        // Si contiene solo dígitos, es un DNI
        return /^\d+$/.test(searchTerm) ? 'dni' : 'name';
    };
    
    // CALCULAR PACIENTES FILTRADOS CON useMemo
    const filteredPatients = useMemo(() => {
        if (!searchTerm.trim()) {
            return patients;
        }

        const searchType = detectSearchType();
        return patients.filter(patient => {
            if (searchType === 'dni') {
                return patient.dni.includes(searchTerm);
            } else {
                return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
        });
    }, [searchTerm, patients]);

    // Abrir modal de historial clínico
    const openMedicalHistory = (patient) => {
        setSelectedPatient(patient);
        setShowMedicalHistoryModal(true);
    };

    // Abrir modal de agendar turno
    const openAppointmentModal = (patient) => {
        setSelectedPatient(patient);
        setNewAppointment({
            date: '',
            time: '',
            reason: 'Consulta general',
            doctor: 'Dr. García',
            notes: `Paciente: ${patient.name} - DNI: ${patient.dni}`
        });
        setShowAppointmentModal(true);
    };

    // Abrir detalles del paciente
    const openPatientDetails = (patient) => {
        setSelectedPatient(patient);
        setShowPatientDetails(true);
    };

    // Paginación
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    };

    return (
        <div className="app">
            <NavBar
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                user={user}
                handleLogout={handleLogout}
            />

            <main className="main-content">
                <div className="view-patient-container">
                    {/* Header */}
                    <div className="header-section">
                        <h1 className="page-title">Gestión de Pacientes</h1>
                        <p className="page-subtitle">Visualiza y administra la información de tus pacientes</p>
                    </div>

                    {/* Barra de búsqueda y filtros */}
                    <SearchPatients 
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                    />

                    {/* Tabla de pacientes */}
                    <PatientsTable 
                        patients={currentPatients}
                        onViewDetails={openPatientDetails}
                        onViewMedicalHistory={openMedicalHistory}
                        onScheduleAppointment={openAppointmentModal}
                    />

                    {/* Paginación */}
                    {filteredPatients.length > 0 && (
                        <PaginationControls 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            filteredPatientsCount={filteredPatients.length}
                            patientsPerPage={patientsPerPage}
                            onPageChange={paginate}
                        />
                    )}

                    {/* Modal - Historial Clínico */}
                    {showMedicalHistoryModal && selectedPatient && (
                        <div className="modal-overlay">
                            <div className="modal medical-history-modal">
                                <div className="modal-header">
                                    <div>
                                        <h3 className="modal-title">Historial Clínico</h3>
                                        <p className="modal-subtitle">{selectedPatient.name} - DNI: {selectedPatient.dni}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowMedicalHistoryModal(false)}
                                        className="close-btn"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <div className="modal-content">
                                    <div className="section">
                                        <h4 className="section-title">Información del Paciente</h4>
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <p className="info-label">Grupo Sanguíneo</p>
                                                <p className="info-value">{selectedPatient.bloodType || 'No especificado'}</p>
                                            </div>
                                            <div className="info-item">
                                                <p className="info-label">Alergias</p>
                                                <p className="info-value">Ninguna registrada</p>
                                            </div>
                                            <div className="info-item">
                                                <p className="info-label">Medicamentos Actuales</p>
                                                <p className="info-value">Ninguno</p>
                                            </div>
                                            <div className="info-item">
                                                <p className="info-label">Enfermedades Crónicas</p>
                                                <p className="info-value">Ninguna</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section">
                                        <h4 className="section-title">Historial de Visitas</h4>
                                        <div className="visits-list">
                                            {[1, 2, 3].map((visit) => (
                                                <div key={visit} className="visit-card">
                                                    <div className="visit-header">
                                                        <div>
                                                            <p className="visit-title">Consulta de rutina</p>
                                                            <p className="visit-meta">Dr. García • 15/01/2024</p>
                                                        </div>
                                                        <span className="visit-status">
                                                            Completada
                                                        </span>
                                                    </div>
                                                    <p className="visit-description">Paciente se presenta para control anual. Todos los parámetros dentro de rangos normales.</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            onClick={() => setShowMedicalHistoryModal(false)}
                                            className="btn-secondary"
                                        >
                                            Cerrar
                                        </button>
                                        <button className="btn-primary">
                                            Nuevo Registro
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal - Agendar Turno */}
                    {showAppointmentModal && selectedPatient && (
                        <div className="modal-overlay">
                            <div className="modal appointment-modal">
                                <div className="modal-header">
                                    <div>
                                        <h3 className="modal-title">Agendar Nuevo Turno</h3>
                                        <p className="modal-subtitle">{selectedPatient.name} - DNI: {selectedPatient.dni}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAppointmentModal(false)}
                                        className="close-btn"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <div className="modal-content">
                                    <div className="form-group">
                                        <label className="form-label">
                                            Fecha *
                                        </label>
                                        <input
                                            type="date"
                                            value={newAppointment.date}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Hora *
                                        </label>
                                        <input
                                            type="time"
                                            value={newAppointment.time}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Motivo
                                        </label>
                                        <select
                                            value={newAppointment.reason}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Consulta general">Consulta general</option>
                                            <option value="Control">Control</option>
                                            <option value="Estudios">Estudios</option>
                                            <option value="Urgencia">Urgencia</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Profesional
                                        </label>
                                        <select
                                            value={newAppointment.doctor}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                                            className="form-input"
                                        >
                                            <option value="Dr. García">Dr. García</option>
                                            <option value="Dra. Martínez">Dra. Martínez</option>
                                            <option value="Dr. Rodríguez">Dr. Rodríguez</option>
                                            <option value="Dra. López">Dra. López</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Notas adicionales
                                        </label>
                                        <textarea
                                            value={newAppointment.notes}
                                            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                            rows="3"
                                            className="form-input textarea"
                                            placeholder="Observaciones importantes..."
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            onClick={() => setShowAppointmentModal(false)}
                                            className="btn-secondary"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleCreateAppointment}
                                            className="btn-primary"
                                        >
                                            <CalendarIcon />
                                            Agendar Turno
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal - Detalles del Paciente */}
                    {showPatientDetails && selectedPatient && (
                        <div className="modal-overlay">
                            <div className="modal patient-details-modal">
                                <div className="modal-header">
                                    <h3 className="modal-title">Detalles del Paciente</h3>
                                    <button
                                        onClick={() => setShowPatientDetails(false)}
                                        className="close-btn"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <div className="modal-content">
                                    <div className="patient-profile">
                                        <div className="profile-avatar">
                                            <UserIcon />
                                        </div>
                                        <div className="profile-info">
                                            <h4 className="profile-name">{selectedPatient.name}</h4>
                                            <p className="profile-dni">DNI: {selectedPatient.dni}</p>
                                        </div>
                                    </div>

                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <p className="detail-label">Edad</p>
                                            <p className="detail-value">{selectedPatient.age} años</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Género</p>
                                            <p className="detail-value">{selectedPatient.gender}</p>
                                        </div>
                                        <div className="detail-item full-width">
                                            <p className="detail-label">Teléfono</p>
                                            <p className="detail-value">{selectedPatient.phone}</p>
                                        </div>
                                        <div className="detail-item full-width">
                                            <p className="detail-label">Email</p>
                                            <p className="detail-value">{selectedPatient.email}</p>
                                        </div>
                                        <div className="detail-item full-width">
                                            <p className="detail-label">Dirección</p>
                                            <p className="detail-value">{selectedPatient.address}</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Grupo Sanguíneo</p>
                                            <p className="detail-value">{selectedPatient.bloodType || 'No especificado'}</p>
                                        </div>
                                    
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            onClick={() => setShowPatientDetails(false)}
                                            className="btn-primary"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewPatient;