import React, { useState, useMemo, useCallback } from 'react';
import '../styles/ViewPatient.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

// Iconos como componentes de React (FUERA del componente)
const SearchIcon = () => <span className="icon">🔍</span>;
const UserIcon = () => <span className="icon">👤</span>;
const CalendarIcon = () => <span className="icon">📅</span>;
const FileIcon = () => <span className="icon">📄</span>;
const EditIcon = () => <span className="icon">✏️</span>;
const TrashIcon = () => <span className="icon">🗑️</span>;
const CloseIcon = () => <span className="icon">✕</span>;
const FilterIcon = () => <span className="icon">⚙️</span>;
const LeftArrow = () => <span className="icon">‹</span>;
const RightArrow = () => <span className="icon">›</span>;

// Datos fuera del componente
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
];

const ViewPatient = ({ setIsAuthenticated, user, setUser }) => {
    // Estado para pacientes
    const [patients, setPatients] = useState(MOCK_PATIENTS);


    // Estado para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // 'name' o 'dni'

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
    const [patientsPerPage] = useState(10);
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
    };
    // CALCULAR PACIENTES FILTRADOS CON useMemo
    const filteredPatients = useMemo(() => {
        if (!searchTerm.trim()) {
            return patients;
        }

        return patients.filter(patient => {
            if (searchBy === 'name') {
                return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return patient.dni.includes(searchTerm);
            }
        });
    }, [searchTerm, searchBy, patients]); // Dependencias

    // Manejar cambio de filtro
    const handleFilterChange = (filter) => {
        setSearchBy(filter);
    };

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
                    <div className="search-section">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <div className="search-icon-container">
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Buscar por ${searchBy === 'name' ? 'nombre' : 'DNI'}...`}
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                            </div>

                            <div className="filters-container">
                                <div className="filter-buttons">
                                    <FilterIcon />
                                    <span className="filter-label">Filtrar por:</span>
                                    <button
                                        onClick={() => handleFilterChange('name')}
                                        className={`filter-btn ${searchBy === 'name' ? 'active' : ''}`}
                                    >
                                        Nombre
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('dni')}
                                        className={`filter-btn ${searchBy === 'dni' ? 'active' : ''}`}
                                    >
                                        DNI
                                    </button>
                                </div>

                                <button className="new-patient-btn">
                                    <UserIcon />
                                    Nuevo Paciente
                                </button>
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="stats-grid">
                            <div className="stat-card blue">
                                <p className="stat-label">Total Pacientes</p>
                                <p className="stat-value">{patients.length}</p>
                            </div>
                            <div className="stat-card green">
                                <p className="stat-label">Pacientes Activos</p>
                                <p className="stat-value">
                                    {patients.filter(p => p.status === 'Activo').length}
                                </p>
                            </div>
                            <div className="stat-card yellow">
                                <p className="stat-label">Turnos Hoy</p>
                                <p className="stat-value">3</p>
                            </div>
                            <div className="stat-card purple">
                                <p className="stat-label">Nuevos Este Mes</p>
                                <p className="stat-value">12</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de pacientes */}
                    <div className="patients-table-container">
                        <div className="table-wrapper">
                            <table className="patients-table">
                                <thead>
                                    <tr>
                                        <th>DNI</th>
                                        <th>Paciente</th>
                                        <th>Contacto</th>
                                        <th>Última Visita</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPatients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>
                                                <span className="dni-text">{patient.dni}</span>
                                            </td>
                                            <td>
                                                <div className="patient-info">
                                                    <div className="patient-avatar">
                                                        <UserIcon />
                                                    </div>
                                                    <div className="patient-details">
                                                        <div className="patient-name">{patient.name}</div>
                                                        <div className="patient-meta">{patient.age} años • {patient.gender}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-info">
                                                    <div>{patient.phone}</div>
                                                    <div className="email-text">{patient.email}</div>
                                                </div>
                                            </td>
                                            <td>
                                                {patient.nextAppointment ? (
                                                    <span className="appointment-badge">
                                                        {formatDate(patient.nextAppointment)}
                                                    </span>
                                                ) : (
                                                    <span className="no-appointment">Sin turno</span>
                                                )}
                                            </td>
                                            
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => openPatientDetails(patient)}
                                                        className="action-btn details-btn"
                                                        title="Ver detalles"
                                                    >
                                                        <UserIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => openMedicalHistory(patient)}
                                                        className="action-btn history-btn"
                                                        title="Historial clínico"
                                                    >
                                                        <FileIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => openAppointmentModal(patient)}
                                                        className="action-btn appointment-btn"
                                                        title="Agendar turno"
                                                    >
                                                        <CalendarIcon />
                                                    </button>
                                                    <button className="action-btn edit-btn" title="Editar">
                                                        <EditIcon />
                                                    </button>
                                                    <button className="action-btn delete-btn" title="Eliminar">
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {filteredPatients.length > 0 && (
                            <div className="pagination-container">
                                <div className="pagination-info">
                                    Mostrando {indexOfFirstPatient + 1} a {Math.min(indexOfLastPatient, filteredPatients.length)} de {filteredPatients.length} pacientes
                                </div>
                                <div className="pagination-buttons">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                    >
                                        <LeftArrow />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`page-number ${currentPage === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                    >
                                        <RightArrow />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sin resultados */}
                        {filteredPatients.length === 0 && (
                            <div className="no-results">
                                <div className="no-results-icon">
                                    <UserIcon />
                                </div>
                                <h3>No se encontraron pacientes</h3>
                                <p>Intenta con otros términos de búsqueda</p>
                            </div>
                        )}
                    </div>

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