        // ============ DATOS DE EJEMPLO ============
        const eventos = [
            {
                id: 1,
                title: ' Entreno de fuerza',
                start: '2026-02-13T10:00:00',
                tipo: 'entreno',
                descripcion: 'Full body + cardio'
            },
            {
                id: 2,
                title: ' Comida de recuperación',
                start: '2026-02-13T14:00:00',
                tipo: 'dieta',
                descripcion: 'Arroz integral, pollo, verduras'
            },
            {
                id: 3,
                title: ' Revisión mensual',
                start: '2026-02-15T09:00:00',
                tipo: 'revision',
                descripcion: 'Medir progreso y ajustar rutina'
            },
            {
                id: 4,
                title: ' Entreno de resistencia',
                start: '2026-02-16T16:00:00',
                tipo: 'entreno',
                descripcion: 'Series largas, baja intensidad'
            }
        ];

        // ============ 1. FULLCALENDAR ============
        const calendarEl = document.getElementById('calendario');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            events: eventos,
            eventClick: function(info) {
                alert(` ${info.event.title}\n ${info.event.extendedProps.descripcion || 'Sin descripción'}`);
            },
            // Colores por tipo de evento
            eventColor: '#3788d8',
            eventDidMount: function(info) {
                switch(info.event.extendedProps.tipo) {
                    case 'entreno':
                        info.el.style.backgroundColor = '#2196F3';
                        break;
                    case 'dieta':
                        info.el.style.backgroundColor = '#4CAF50';
                        break;
                    case 'revision':
                        info.el.style.backgroundColor = '#FF9800';
                        break;
                }
            }
        });
        
        calendar.render();

        // ============ 2. FLATPICKR ============
        const flatpickrInstance = flatpickr("#fecha-evento", {
            locale: 'es',
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: "today",
            defaultDate: new Date(),
            time_24hr: true
        });

        // ============ 3. CHART.JS ============
        const ctx = document.getElementById('grafico-peso').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'],
                datasets: [{
                    label: 'Peso (kg)',
                    data: [82, 81.2, 80.5, 79.8, 79, 78.3],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // ============ 4. CREAR EVENTOS ============
        document.getElementById('btn-crear-evento').addEventListener('click', function() {
            // Obtener valores
            const tipo = document.getElementById('tipo-evento').value;
            const titulo = document.getElementById('titulo-evento').value;
            const fecha = document.getElementById('fecha-evento').value;
            const descripcion = document.getElementById('descripcion-evento').value;
            
            // Validar campos
            if (!titulo || !fecha) {
                alert(' El título y la fecha son obligatorios');
                return;
            }
            
            // Emojis por tipo
            const emojis = {
                entreno: '🏃',
                dieta: '🥗',
                revision: '📋'
            };
            
            // Crear nuevo evento
            const nuevoEvento = {
                id: eventos.length + 1,
                title: `${emojis[tipo]} ${titulo}`,
                start: fecha,
                tipo: tipo,
                descripcion: descripcion || 'Sin descripción'
            };
            
            // Agregar al array y al calendario
            eventos.push(nuevoEvento);
            calendar.addEvent(nuevoEvento);
            
            // Limpiar formulario
            document.getElementById('titulo-evento').value = '';
            document.getElementById('descripcion-evento').value = '';
            flatpickrInstance.setDate(new Date());
            
            alert(' Evento creado correctamente');
        });
