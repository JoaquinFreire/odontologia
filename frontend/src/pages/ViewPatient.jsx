/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import '../styles/ViewPatient.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchPatients from '../components/SearchPatients';
import { getAllPatients, calculateAge } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';

const UserIcon = () => <span className="icon">👤</span>;

const ViewPatient = ({ setIsAuthenticated, user, setUser }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);
    const [patientsPerPage] = useState(10);

    // Modales
    const [showPatientDetails, setShowPatientDetails] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    // Datos de Cobro
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [newPayment, setNewPayment] = useState({
        amount: '', method: 'Efectivo', date: new Date().toISOString().split('T')[0]
    });

    // Datos de Turno
    const [appointmentFormData, setAppointmentFormData] = useState({
        name: '', date: '', time: '', type: '', dni: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loadPatients = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const result = await getAllPatients(user.id, currentPage, patientsPerPage);
                if (result.success) {
                    setPatients(result.data);
                    setTotalPages(result.pagination.totalPages);
                    setTotalPatients(result.pagination.totalPatients);
                }
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        loadPatients();
    }, [user, currentPage, patientsPerPage]);

    // Handlers Cobros
    const openPaymentModal = (patient) => {
        setSelectedPatient(patient);
        setPaymentHistory([{ id: 1, date: '2026-01-01', amount: 500, method: 'Efectivo' }]); // Ejemplo
        setTotalBudget(1000);
        setShowPaymentModal(true);
    };

    const handleAddPayment = (e) => {
        e.preventDefault();
        if (!newPayment.amount || newPayment.amount <= 0) return;
        const transaction = { id: Date.now(), ...newPayment, amount: parseFloat(newPayment.amount) };
        setPaymentHistory([...paymentHistory, transaction]);
        setNewPayment({ ...newPayment, amount: '' });
    };

    const totalPaid = paymentHistory.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = totalBudget - totalPaid;

    // Handlers Turnos
    const openAppointmentModal = (patient) => {
        setSelectedPatient(patient);
        setAppointmentFormData({
            name: `${patient.name} ${patient.lastname}`,
            date: '', time: '', type: '', dni: patient.dni
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


    // Cambiar página
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderContent = () => {
        if (patients.length === 0) {
            return (
                <div className="no-results">
                    <p style={{ fontSize: '18px', color: '#666' }}>
                        No hay pacientes registrados
                    </p>
                </div>
            );
        }
        return (
            <>
                <div className="patients-table-container">
                    <div className="table-wrapper">
                        <table className="patients-table">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>DNI</th>
                                    <th>Edad</th>
                                    <th>Ocupación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="patient-info">
                                                    <div className="patient-avatar"><UserIcon /></div>
                                                    <span className="patient-name">{p.name} {p.lastname}</span>
                                                </div>
                                            </td>
                                            <td className="dni-text">{p.dni}</td>
                                            <td>{calculateAge(p.birthdate)} años</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn details-btn" title="Ver" onClick={() => { setSelectedPatient(p); setShowPatientDetails(true); }}>👁️</button>
                                                    <button className="action-btn history-btn" title="Clínica" onClick={() => navigate(`/patient/${p.id}/medical-history`)}>📋</button>
                                                    <button className="action-btn appointment-btn" title="Turno" onClick={() => openAppointmentModal(p)}>📅</button>
                                                    <button className="action-btn payment-btn" title="Cobros" onClick={() => openPaymentModal(p)}>$</button>
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
        );
    };

    return (
        <div className="app">
            <NavBar user={user} handleLogout={() => navigate('/login')} activeNav="patients" />
            <main className="main-content">
                <div className="view-patient-container">
                    <div className="header-section">
                        <h1 className="page-title">Gestión de Pacientes</h1>
                        <p className="page-subtitle">Control clínico y de pagos</p>
                    </div>

                    <SearchPatients searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />

                    {renderContent()}
                    {/* MODAL COBROS */}
                    {showPaymentModal && selectedPatient && (
                        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                            <div className="modal payment-modal wide" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3 className="modal-title">Control de Cobros - {selectedPatient.name}</h3>
                                    <button onClick={() => setShowPaymentModal(false)} className="close-btn">✕</button>
                                </div>
                                <div className="modal-content">
                                    <div className="payment-summary-grid">
                                        <div className="payment-card">
                                            <span className="payment-label">Presupuesto</span>
                                            <input type="number" className="inline-edit-input" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value))} />
                                        </div>
                                        <div className="payment-card paid">
                                            <span className="payment-label">Abonado</span>
                                            <span className="payment-value">${totalPaid.toLocaleString()}</span>
                                        </div>
                                        <div className={`payment-card pending ${pendingAmount > 0 ? 'debt' : 'settled'}`}>
                                            <span className="payment-label">Pendiente</span>
                                            <span className="payment-value">{pendingAmount <= 0 ? '✓ Pagado' : `$${pendingAmount.toLocaleString()}`}</span>
                                        </div>
                                    </div>
                                    <hr className="divider" />
                                    <form className="add-payment-form" onSubmit={handleAddPayment}>
                                        <h4 className="section-subtitle">Nuevo Abono</h4>
                                        <div className="payment-inputs-row">
                                            <div className="input-group"><input type="date" value={newPayment.date} onChange={e => setNewPayment({...newPayment, date: e.target.value})} className="form-input" /></div>
                                            <div className="input-group">
                                                <select value={newPayment.method} onChange={e => setNewPayment({...newPayment, method: e.target.value})} className="form-input">
                                                    <option value="Efectivo">Efectivo</option>
                                                    <option value="Transferencia">Transferencia</option>
                                                    <option value="Tarjeta">Tarjeta</option>
                                                </select>
                                            </div>
                                            <div className="input-group"><input type="number" placeholder="Monto $" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} className="form-input" /></div>
                                            <button type="submit" className="btn-add-payment">Registrar</button>
                                        </div>
                                    </form>
                                    <div className="mini-table-container">
                                        <table className="mini-table">
                                            <thead><tr><th>Fecha</th><th>Método</th><th>Monto</th></tr></thead>
                                            <tbody>
                                                {paymentHistory.map(h => (
                                                    <tr key={h.id}><td>{h.date}</td><td><span className={`method-badge ${h.method.toLowerCase()}`}>{h.method}</span></td><td>${h.amount}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MODAL TURNOS (Simplificado) */}
                    {showAppointmentModal && (
                        <div className="modal-overlay" onClick={() => setShowAppointmentModal(false)}>
                            <div className="modal appointment-modal" onClick={e => e.stopPropagation()}>
                                <div className="modal-header"><h3>Agendar Turno</h3><button onClick={() => setShowAppointmentModal(false)} className="close-btn">✕</button></div>
                                <div className="modal-content">
                                    <p>Paciente: <strong>{appointmentFormData.name}</strong></p>
                                    <div className="form-group"><label>Fecha</label><input type="date" className="form-input" /></div>
                                    <div className="modal-footer"><button className="btn-primary" onClick={() => setShowAppointmentModal(false)}>Guardar Turno</button></div>
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