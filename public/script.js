document.addEventListener('DOMContentLoaded', () => {
    const loadUsersBtn = document.getElementById('load-users-btn');

    const navHome = document.getElementById('nav-home');
    const navUsers = document.getElementById('nav-users');
    const navPatients = document.getElementById('nav-patients');
    const navDoctors = document.getElementById('nav-doctors');

    const homeSection = document.getElementById('home-section');
    const usersSection = document.getElementById('users-section');
    const patientsSection = document.getElementById('patients-section');
    const doctorsSection = document.getElementById('doctors-section');

    const API_BASE_URL = 'http://localhost:7050/api';

    function showSection(sectionToShow) {
        [homeSection, usersSection, patientsSection, doctorsSection].forEach(section => {
            if (section) section.style.display = 'none';
        });
        if (sectionToShow) sectionToShow.style.display = 'block';
    }

    async function loadDataAndRender(sectionElement, apiEndpoint, title, itemRenderer) {
        showSection(sectionElement);
        sectionElement.innerHTML = `<h2>${title}</h2><p>Cargando ${title.toLowerCase()}...</p>`;

        try {
            const response = await fetch(`${API_BASE_URL}${apiEndpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            let htmlContent = `<h2>${title}</h2>`;
            if (data.length > 0) {
                htmlContent += `<h3>Lista de ${title}:</h3><ul>`;
                data.forEach(item => {
                    htmlContent += itemRenderer(item);
                });
                htmlContent += '</ul>';
            } else {
                htmlContent += `<p>No hay ${title.toLowerCase()} registrados.</p>`;
            }

            sectionElement.innerHTML = htmlContent;

        } catch (error) {
            console.error(`Error al obtener ${title.toLowerCase()}:`, error);
            sectionElement.innerHTML = `<h2 style="color:red;">Error al cargar ${title.toLowerCase()}: ${error.message}</h2>`;
        }
    }

    function renderUserItem(user) {
        return `<li>DNI: ${user.dni || 'N/A'} - Nombre: ${user.nombre || 'N/A'} - Email: ${user.email || 'N/A'}</li>`;
    }

    function renderPatientItem(patient) {
        return `<li>ID: ${patient.id_cuenta || 'N/A'} - Nombre: ${patient.nombre || 'N/A'} - Email: ${patient.email || 'N/A'}</li>`;
    }

    function renderDoctorItem(doctor) {
        return `<li>Legajo: ${doctor.legajo || 'N/A'} - Nombre: ${doctor.nombre || 'N/A'} - Apellido: ${doctor.apellido || 'N/A'} - Especialidad: ${doctor.nombre_especialidad || 'N/A'} - Teléfono: ${doctor.telefono || 'N/A'}</li>`;
    }

    function loadUsers() {
        loadDataAndRender(usersSection, '/users', 'Usuarios', renderUserItem);
    }

    function loadPatients() {
        loadDataAndRender(patientsSection, '/patients', 'Pacientes', renderPatientItem);
    }

    function loadDoctors() {
        loadDataAndRender(doctorsSection, '/doctors', 'Médicos', renderDoctorItem);
    }

    if (loadUsersBtn) loadUsersBtn.addEventListener('click', loadUsers);

    if (navHome) navHome.addEventListener('click', e => {
        e.preventDefault();
        showSection(homeSection);
    });

    if (navUsers) navUsers.addEventListener('click', e => {
        e.preventDefault();
        loadUsers();
    });

    if (navPatients) navPatients.addEventListener('click', e => {
        e.preventDefault();
        loadPatients();
    });

    if (navDoctors) navDoctors.addEventListener('click', e => {
        e.preventDefault();
        loadDoctors();
    });

    showSection(homeSection);
}); 