        // ============ DATOS DE EJEMPLO ============
        const pacientes = [
            { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Golden Retriever', edad: 5, dueno: 'Carlos Ruiz', telefono: '612345678' },
            { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Persa', edad: 3, dueno: 'Ana García', telefono: '623456789' },
            { id: 3, nombre: 'Toby', especie: 'Perro', raza: 'Bulldog Francés', edad: 2, dueno: 'María López', telefono: '634567890' },
            { id: 4, nombre: 'Simba', especie: 'Gato', raza: 'Común', edad: 7, dueno: 'Javier Martínez', telefono: '645678901' },
            { id: 5, nombre: 'Kira', especie: 'Perro', raza: 'Pastor Alemán', edad: 4, dueno: 'Laura Sánchez', telefono: '656789012' }
        ];

        let citas = [
            { id: 1, title: 'Max - Revisión', start: '2026-02-13T10:00:00', veterinarian: 'Dra. Martínez', tipo: 'Revisión' },
            { id: 2, title: 'Luna - Vacunación', start: '2026-02-13T11:30:00', veterinarian: 'Dr. García', tipo: 'Vacunación' },
            { id: 3, title: 'Toby - Cirugía', start: '2026-02-14T09:00:00', veterinarian: 'Dra. Martínez', tipo: 'Cirugía' },
            { id: 4, title: 'Simba - Odontología', start: '2026-02-14T12:00:00', veterinarian: 'Dra. López', tipo: 'Odontología' }
        ];

        // ============ 1. FULLCALENDAR ============
        const calendarEl = document.getElementById('calendario');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: citas,
            slotMinTime: '08:00:00',
            slotMaxTime: '20:00:00',
            allDaySlot: false,
            height: 500,
            eventDidMount: function(info) {
                // Color por veterinario
                switch(info.event.extendedProps.veterinarian) {
                    case 'Dra. Martínez':
                        info.el.style.backgroundColor = '#FF6B6B';
                        break;
                    case 'Dr. García':
                        info.el.style.backgroundColor = '#4ECDC4';
                        break;
                    case 'Dra. López':
                        info.el.style.backgroundColor = '#FFE66D';
                        info.el.style.color = '#333';
                        break;
                }
            },
            eventClick: function(info) {
                alert(`📅 Cita: ${info.event.title}\n👩‍⚕️ Veterinario: ${info.event.extendedProps.veterinarian}\n🩺 Tipo: ${info.event.extendedProps.tipo}`);
            }
        });

        calendar.render();

        // ============ 2. FLATPICKR ============
        const flatpickrInstance = flatpickr("#cita-fecha", {
            locale: 'es',
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: "today",
            defaultDate: new Date(),
            time_24hr: true,
            minTime: "08:00",
            maxTime: "20:00"
        });

        // ============ 3. FILEPOND - SUBIR ARCHIVOS ============
        const pond = FilePond.create(document.querySelector('#filepond-upload'), {
            labelIdle: '📎 Arrastra tus archivos o <span style="color: #43C6AC;">haz clic</span>',
            acceptedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
            maxFileSize: '10MB',
            server: {
                process: {
                    url: '/upload.php',
                    onload: (response) => {
                        console.log('✅ Archivo subido:', response);
                        return response;
                    }
                }
            }
        });

        // ============ 4. TABULATOR - LISTADO PACIENTES ============
        const tablaPacientes = new Tabulator('#tabla-pacientes', {
            data: pacientes,
            layout: 'fitColumns',
            pagination: 'local',
            paginationSize: 5,
            movableColumns: true,
            resizableRows: false,
            columns: [
                { 
                    title: '', 
                    field: 'id',
                    width: 50,
                    formatter: function() {
                        return '🐾';
                    }
                },
                { title: 'Nombre', field: 'nombre', sorter: 'string', widthGrow: 2 },
                { title: 'Especie', field: 'especie', sorter: 'string', widthGrow: 1 },
                { title: 'Raza', field: 'raza', sorter: 'string', widthGrow: 2 },
                { 
                    title: 'Edad', 
                    field: 'edad', 
                    sorter: 'number',
                    widthGrow: 1,
                    formatter: function(cell) {
                        return `${cell.getValue()} años`;
                    }
                },
                { title: 'Dueño', field: 'dueno', sorter: 'string', widthGrow: 2 },
                { 
                    title: 'Contacto', 
                    field: 'telefono', 
                    sorter: 'string',
                    widthGrow: 2,
                    formatter: function(cell) {
                        return `📞 ${cell.getValue()}`;
                    }
                }
            ],
            placeholder: 'No hay pacientes registrados',
            initialSort: [
                { column: 'nombre', dir: 'asc' }
            ]
        });

        // ============ FUNCIÓN CREAR CITA ============
        function crearCita() {
            const mascota = document.getElementById('cita-mascota');
            const veterinario = document.getElementById('cita-veterinario');
            const tipo = document.getElementById('cita-tipo');
            const fecha = document.getElementById('cita-fecha');
            const motivo = document.getElementById('cita-motivo');
            
            if (!mascota.value || !veterinario.value || !fecha.value) {
                alert('❌ Por favor, completa todos los campos obligatorios');
                return;
            }

            // Obtener nombre de la mascota
            const mascotaText = mascota.options[mascota.selectedIndex].text;
            const mascotaNombre = mascotaText.split('-')[1].trim();

            // Crear nueva cita
            const nuevaCita = {
                id: citas.length + 1,
                title: `${mascotaNombre} - ${tipo.value}`,
                start: fecha.value,
                veterinarian: veterinario.value,
                tipo: tipo.value
            };

            // Agregar al calendario
            citas.push(nuevaCita);
            calendar.addEvent(nuevaCita);

            // Limpiar formulario
            mascota.value = '1';
            veterinario.value = 'Dra. Martínez';
            tipo.value = 'Revisión';
            document.getElementById('cita-motivo').value = '';
            flatpickrInstance.setDate(new Date());
            
            // Eliminar archivos de FilePond
            pond.removeFiles();

            alert('✅ Cita programada correctamente');
        }

        // ============ INICIALIZACIÓN ============
        document.addEventListener('DOMContentLoaded', () => {
            // Actualizar stats
            const citasHoy = citas.filter(c => c.start.startsWith('2026-02-13')).length;
            document.getElementById('stats-citas-hoy').innerHTML = citasHoy;
            document.getElementById('stats-pacientes').innerHTML = pacientes.length;
        });
