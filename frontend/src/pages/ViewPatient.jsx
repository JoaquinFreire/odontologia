// eslint-disable-next-line no-unused-vars
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import '../styles/ViewPatient.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchPatients from '../components/SearchPatients';
import PatientsTable from '../components/PatientsTable';
import PaginationControls from '../components/PaginationControls';
import { getAllPatients, calculateAge } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';

// Iconos como componentes de React
const UserIcon = () => <span className="icon">👤</span>;
const CalendarIcon = () => <span className="icon">📅</span>;
const CloseIcon = () => <span className="icon">✕</span>;

const ViewPatient = ({ setIsAuthenticated, user, setUser }) => {
    // Estado para pacientes
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [patientsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);

    // Modales
    const [showPatientDetails, setShowPatientDetails] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    // Paciente seleccionado
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Formulario de turno
    const [appointmentFormData, setAppointmentFormData] = useState({
        name: '',
        date: '',
        time: '',
        type: '',
        dni: ''
    });
    const [schedulingAppointment, setSchedulingAppointment] = useState(false);

    const [activeNav, setActiveNav] = useState('patients');
    const navigate = useNavigate();

    // Cargar pacientes cuando cambia la página o el usuario
    useEffect(() => {
        const loadPatients = async () => {
            if (!user || !user.id) {
                console.error('No user found');
                return;
            }

            try {
                setLoading(true);
                console.log(`Cargando pacientes - página ${currentPage}`);
                
                const result = await getAllPatients(user.id, currentPage, patientsPerPage);
                
                if (result.success) {
                    setPatients(result.data);
                    setTotalPages(result.pagination.totalPages);
                    setTotalPatients(result.pagination.totalPatients);
                    console.log('Pacientes cargados:', result.data.length);
                    console.log('Total de pacientes:', result.pagination.totalPatients);
                    console.log('Total de páginas:', result.pagination.totalPages);
                } else {
                    console.error('Error al cargar pacientes:', result.error);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, [user, currentPage, patientsPerPage]);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    // Manejar búsqueda (filtrado local de los 10 pacientes actuales)
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Detectar automáticamente si es DNI o nombre
    const detectSearchType = () => {
        if (!searchTerm.trim()) return null;
        return /^\d+$/.test(searchTerm) ? 'dni' : 'name';
    };

    // FILTRAR PACIENTES LOCALMENTE (de los 10 cargados)
    const filteredPatients = useMemo(() => {
        if (!searchTerm.trim()) {
            return patients;
        }

        const searchType = detectSearchType();
        return patients.filter(patient => {
            if (searchType === 'dni') {
                return patient.dni.includes(searchTerm);
            } else {
                return patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       patient.lastname.toLowerCase().includes(searchTerm.toLowerCase());
            }
        });
    }, [searchTerm, patients]);

    // Abrir detalles del paciente
    const openPatientDetails = (patient) => {
        setSelectedPatient(patient);
        setShowPatientDetails(true);
    };

    // Abrir modal de agendar turno
    const openAppointmentModal = (patient) => {
        setSelectedPatient(patient);
        setAppointmentFormData({
            name: `${patient.name} ${patient.lastname}`,
            date: '',
            time: '',
            type: '',
            dni: patient.dni
        });
        setShowAppointmentModal(true);
    };

    // Cerrar modal de turno
    const handleCloseAppointmentModal = () => {
        setShowAppointmentModal(false);
        setSelectedPatient(null);
        setAppointmentFormData({
            name: '',
            date: '',
            time: '',
            type: '',
            dni: ''
        });
    };

    // Manejar cambios en el formulario de turno
    const handleAppointmentFormChange = (e) => {
        const { name, value } = e.target;
        setAppointmentFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Enviar turno
    const handleSubmitAppointment = async (e) => {
        e.preventDefault();

        if (!appointmentFormData.name || !appointmentFormData.date || !appointmentFormData.time || !appointmentFormData.type) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        setSchedulingAppointment(true);

        try {
            console.log('=== ENVIANDO TURNO ===');
            console.log('Form data:', appointmentFormData);
            console.log('User ID:', user.id);

            await appointmentService.createAppointment(appointmentFormData, user.id);

            alert(`✓ Turno agendado para ${appointmentFormData.name} el ${appointmentFormData.date} a las ${appointmentFormData.time}`);
            handleCloseAppointmentModal();
        } catch (error) {
            console.error('Error al crear turno:', error);
            alert(`✗ Error: ${error.message}`);
        } finally {
            setSchedulingAppointment(false);
        }
    };

    // Ir a historial clínico
    const openMedicalHistory = (patient) => {
        navigate(`/patients/${patient.id}/history`);
    };

    // Cambiar página
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    };

    // Crear datos formateados para la tabla
    const tablePatients = filteredPatients.map(patient => ({
        ...patient,
        age: calculateAge(patient.birthdate),
        fullName: `${patient.name} ${patient.lastname}`
    }));

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

                    {/* Barra de búsqueda */}
                    <SearchPatients 
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                    />

                    {/* Tabla de pacientes */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Cargando pacientes...</p>
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="no-results">
                            <p style={{ fontSize: '18px', color: '#666' }}>
                                No hay pacientes registrados
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="patients-table-container">
                                <div className="table-wrapper">
                                    <table className="patients-table">
                                        <thead>
                                            <tr>
                                                <th>Nombre y Apellido</th>
                                                <th>DNI</th>
                                                <th>Edad</th>
                                                <th>Ocupación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tablePatients.length > 0 ? (
                                                tablePatients.map(patient => (
                                                    <tr key={patient.id}>
                                                        <td>
                                                            <div className="patient-info">
                                                                <div className="patient-avatar">
                                                                    <UserIcon />
                                                                </div>
                                                                <div className="patient-details">
                                                                    <p className="patient-name">{patient.fullName}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="dni-text">{patient.dni}</td>
                                                        <td>{patient.age ? `${patient.age} años` : 'N/A'}</td>
                                                        <td>{patient.occupation || '-'}</td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="action-btn details-btn"
                                                                    title="Ver detalles"
                                                                    onClick={() => openPatientDetails(patient)}
                                                                >
                                                                    👁️
                                                                </button>
                                                                <button
                                                                    className="action-btn history-btn"
                                                                    title="Historial clínico"
                                                                    onClick={() => openMedicalHistory(patient)}
                                                                >
                                                                    📋
                                                                </button>
                                                                <button
                                                                    className="action-btn appointment-btn"
                                                                    title="Agendar turno"
                                                                    onClick={() => openAppointmentModal(patient)}
                                                                >
                                                                    📅
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                        No se encontraron pacientes con esa búsqueda
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <div className="pagination-info">
                                        Página {currentPage} de {totalPages} • Total: {totalPatients} pacientes
                                    </div>
                                    <div className="pagination-buttons">
                                        <button
                                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            ←
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                className={`page-number ${currentPage === page ? 'active' : ''}`}
                                                onClick={() => paginate(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                             →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Modal - Detalles del Paciente */}
                    {showPatientDetails && selectedPatient && (
                        <div className="modal-overlay" onClick={() => setShowPatientDetails(false)}>
                            <div className="modal patient-details-modal" onClick={(e) => e.stopPropagation()}>
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
                                            <h4 className="profile-name">{selectedPatient.name} {selectedPatient.lastname}</h4>
                                            <p className="profile-dni">DNI: {selectedPatient.dni}</p>
                                        </div>
                                    </div>

                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <p className="detail-label">Edad</p>
                                            <p className="detail-value">{calculateAge(selectedPatient.birthdate) || 'N/A'} años</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Fecha de Nacimiento</p>
                                            <p className="detail-value">{formatDate(selectedPatient.birthdate)}</p>
                                        </div>
                                        <div className="detail-item full-width">
                                            <p className="detail-label">Teléfono</p>
                                            <p className="detail-value">{selectedPatient.tel || 'No especificado'}</p>
                                        </div>
                                        <div className="detail-item full-width">
                                            <p className="detail-label">Email</p>
                                            <p className="detail-value">{selectedPatient.email || 'No especificado'}</p>
                                        </div>
                                        <div className="detail-item full-width">
                                            <p className="detail-label">Dirección</p>
                                            <p className="detail-value">{selectedPatient.address || 'No especificada'}</p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="detail-label">Ocupación</p>
                                            <p className="detail-value">{selectedPatient.occupation || 'No especificada'}</p>
                                        </div>
                                        {selectedPatient.affiliate_number && (
                                            <div className="detail-item">
                                                <p className="detail-label">Nro. Afiliado</p>
                                                <p className="detail-value">{selectedPatient.affiliate_number}</p>
                                            </div>
                                        )}
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

                    {/* Modal - Agendar Turno */}
                    {showAppointmentModal && selectedPatient && (
                        <div className="modal-overlay" onClick={handleCloseAppointmentModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Agendar Nuevo Turno</h2>
                                    <button className="modal-close" onClick={handleCloseAppointmentModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>

                                <form className="appointment-form" onSubmit={handleSubmitAppointment}>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre completo *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={appointmentFormData.name}
                                            onChange={handleAppointmentFormChange}
                                            placeholder="Ej: María González"
                                            required
                                            disabled={schedulingAppointment}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="dni">DNI</label>
                                        <input
                                            type="text"
                                            id="dni"
                                            name="dni"
                                            value={appointmentFormData.dni}
                                            placeholder="Ej: 12345678"
                                            disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="date">Fecha *</label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            value={appointmentFormData.date}
                                            onChange={handleAppointmentFormChange}
                                            required
                                            disabled={schedulingAppointment}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="time">Hora *</label>
                                        <input
                                            type="time"
                                            id="time"
                                            name="time"
                                            value={appointmentFormData.time}
                                            onChange={handleAppointmentFormChange}
                                            required
                                            disabled={schedulingAppointment}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="type">Tipo de Tratamiento *</label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={appointmentFormData.type}
                                            onChange={handleAppointmentFormChange}
                                            required
                                            disabled={schedulingAppointment}
                                        >
                                            <option value="">Seleccionar tratamiento...</option>
                                            <option value="Consulta">Consulta</option>
                                            <option value="Limpieza dental">Limpieza dental</option>
                                            <option value="Extracción">Extracción</option>
                                            <option value="Blanqueamiento">Blanqueamiento</option>
                                            <option value="Ortodoncia">Ortodoncia</option>
                                            <option value="Implante dental">Implante dental</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    <div className="modal-actions">
                                        <button type="button" className="btn-outline" onClick={handleCloseAppointmentModal} disabled={schedulingAppointment}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-primary" disabled={schedulingAppointment}>
                                            {schedulingAppointment ? 'Agendando...' : 'Agendar Turno'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ViewPatient;