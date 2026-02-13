        // ============ DATOS DE EJEMPLO ============
        const subastas = [
            { 
                id: 1, 
                titulo: '🎧 Sony WH-1000XM4', 
                precio: 220, 
                precio_inicial: 180,
                tiempo_restante: 3600, // 1 hora en segundos
                pujas: 12,
                imagen: '🎧'
            },
            { 
                id: 2, 
                titulo: '📱 iPhone 13 Pro', 
                precio: 650, 
                precio_inicial: 550,
                tiempo_restante: 7200, // 2 horas
                pujas: 24,
                imagen: '📱'
            },
            { 
                id: 3, 
                titulo: '💻 MacBook Air M1', 
                precio: 899, 
                precio_inicial: 800,
                tiempo_restante: 5400, // 1.5 horas
                pujas: 31,
                imagen: '💻'
            },
            { 
                id: 4, 
                titulo: '⌚ Apple Watch S7', 
                precio: 320, 
                precio_inicial: 280,
                tiempo_restante: 2700, // 45 minutos
                pujas: 8,
                imagen: '⌚'
            },
            { 
                id: 5, 
                titulo: '🎮 PlayStation 5', 
                precio: 550, 
                precio_inicial: 480,
                tiempo_restante: 1800, // 30 minutos
                pujas: 42,
                imagen: '🎮'
            },
            { 
                id: 6, 
                titulo: '📷 Cámara Sony A6400', 
                precio: 780, 
                precio_inicial: 700,
                tiempo_restante: 4500, // 1.25 horas
                pujas: 15,
                imagen: '📷'
            }
        ];

        const pujas = [
            { id: 1, usuario: 'Carlos G.', producto: 'iPhone 13 Pro', cantidad: 650, fecha: '2026-02-12 15:23' },
            { id: 2, usuario: 'Ana M.', producto: 'MacBook Air M1', cantidad: 899, fecha: '2026-02-12 15:18' },
            { id: 3, usuario: 'Luis R.', producto: 'PlayStation 5', cantidad: 550, fecha: '2026-02-12 15:05' },
            { id: 4, usuario: 'María L.', producto: 'Sony WH-1000XM4', cantidad: 220, fecha: '2026-02-12 14:55' },
            { id: 5, usuario: 'Javier P.', producto: 'Apple Watch S7', cantidad: 320, fecha: '2026-02-12 14:42' },
            { id: 6, usuario: 'Elena S.', producto: 'Cámara Sony A6400', cantidad: 780, fecha: '2026-02-12 14:30' },
            { id: 7, usuario: 'David N.', producto: 'iPhone 13 Pro', cantidad: 645, fecha: '2026-02-12 14:15' },
            { id: 8, usuario: 'Sofia R.', producto: 'PlayStation 5', cantidad: 540, fecha: '2026-02-12 14:00' }
        ];

        // ============ ESTADO GLOBAL ============
        let subastasFiltradas = [...subastas];
        let timers = [];
        let tabulatorTable = null;

        // ============ 1. noUiSlider - FILTRO DE PRECIO ============
        function initSlider() {
            const slider = document.getElementById('slider-precio');
            const minLabel = document.getElementById('precio-min-label');
            const maxLabel = document.getElementById('precio-max-label');
            
            noUiSlider.create(slider, {
                start: [0, 1000],
                connect: true,
                step: 10,
                range: {
                    'min': 0,
                    'max': 1000
                },
                format: {
                    to: value => Math.round(value),
                    from: value => Math.round(value)
                }
            });

            slider.noUiSlider.on('update', (values) => {
                const min = parseInt(values[0]);
                const max = parseInt(values[1]);
                
                minLabel.innerHTML = `${min} €`;
                maxLabel.innerHTML = `${max} €`;
                
                filtrarPorPrecio(min, max);
            });
        }

        function filtrarPorPrecio(min, max) {
            subastasFiltradas = subastas.filter(s => s.precio >= min && s.precio <= max);
            document.getElementById('filtro-contador').innerHTML = `${subastasFiltradas.length} subastas`;
            renderizarSubastas();
            actualizarStats();
        }

        // ============ 2. EasyTimer.js - COUNTDOWN ============
        function iniciarCountdown(elementId, segundos, subastaId) {
            const timer = new Timer();
            const container = document.getElementById(elementId);
            
            timer.start({ countdown: true, startValues: { seconds: segundos } });
            
            timer.addEventListener('secondsUpdated', () => {
                const values = timer.getTimeValues();
                container.innerHTML = `
                    <div class="countdown-tiempo">
                        ${values.hours.toString().padStart(2, '0')}:
                        ${values.minutes.toString().padStart(2, '0')}:
                        ${values.seconds.toString().padStart(2, '0')}
                    </div>
                    <div class="countdown-label">tiempo restante</div>
                `;
            });

            timer.addEventListener('targetAchieved', () => {
                container.innerHTML = '<div class="subasta-terminado">⏰ SUBASTA FINALIZADA</div>';
                
                // Deshabilitar botón
                const btn = document.querySelector(`.btn-pujar[data-id="${subastaId}"]`);
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = 'Finalizada';
                }
                
                // Marcar card
                const card = document.querySelector(`.subasta-card[data-id="${subastaId}"]`);
                if (card) card.classList.add('terminado');
            });

            timers.push(timer);
            return timer;
        }

        // ============ RENDERIZAR SUBASTAS ============
        function renderizarSubastas() {
            const grid = document.getElementById('subastas-grid');
            
            grid.innerHTML = subastasFiltradas.map(subasta => {
                const cardId = `countdown-${subasta.id}`;
                
                return `
                    <div class="subasta-card" data-id="${subasta.id}">
                        <div style="font-size: 3rem; text-align: center; margin-bottom: 10px;">
                            ${subasta.imagen}
                        </div>
                        <div class="subasta-titulo">${subasta.titulo}</div>
                        <div class="subasta-precio">
                            ${subasta.precio}€ 
                            <span>| ${subasta.pujas} pujas</span>
                        </div>
                        
                        <div id="${cardId}" class="countdown-container">
                            <div class="countdown-tiempo">Cargando...</div>
                        </div>
                        
                        <button class="btn-pujar" data-id="${subasta.id}" onclick="simularPuja(${subasta.id})">
                            🚀 Pujar ahora
                        </button>
                    </div>
                `;
            }).join('');

            // Iniciar countdowns después de renderizar
            subastasFiltradas.forEach(subasta => {
                const cardId = `countdown-${subasta.id}`;
                if (document.getElementById(cardId)) {
                    iniciarCountdown(cardId, subasta.tiempo_restante, subasta.id);
                }
            });
        }

        // ============ SIMULAR PUJA ============
        function simularPuja(subastaId) {
            const subasta = subastas.find(s => s.id === subastaId);
            if (!subasta) return;
            
            // Incrementar precio y pujas
            const incremento = Math.floor(Math.random() * 10) + 5;
            subasta.precio += incremento;
            subasta.pujas += 1;
            
            // Añadir puja a la tabla
            const nuevaPuja = {
                id: pujas.length + 1,
                usuario: `Usuario${Math.floor(Math.random() * 100)}`,
                producto: subasta.titulo,
                cantidad: subasta.precio,
                fecha: new Date().toLocaleString('es-ES', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            pujas.unshift(nuevaPuja);
            
            // Actualizar UI
            renderizarSubastas();
            actualizarTablaPujas();
            actualizarStats();
            
            alert(`✅ ¡Puja realizada!\nNuevo precio: ${subasta.precio}€`);
        }

        // ============ 3. Tabulator - TABLA DE PUJAS ============
        function initTablaPujas() {
            tabulatorTable = new Tabulator('#tabla-pujas', {
                data: pujas,
                layout: 'fitColumns',
                pagination: 'local',
                paginationSize: 5,
                paginationSizeSelector: [5, 10, 20],
                movableColumns: true,
                resizableRows: false,
                columns: [
                    { title: 'Usuario', field: 'usuario', sorter: 'string', widthGrow: 2 },
                    { title: 'Producto', field: 'producto', sorter: 'string', widthGrow: 3 },
                    { 
                        title: 'Cantidad', 
                        field: 'cantidad', 
                        sorter: 'number',
                        widthGrow: 2,
                        formatter: function(cell) {
                            return `💰 ${cell.getValue()}€`;
                        },
                        cssClass: 'text-bold'
                    },
                    { 
                        title: 'Fecha', 
                        field: 'fecha', 
                        sorter: 'string',
                        widthGrow: 2,
                        formatter: function(cell) {
                            return `📅 ${cell.getValue()}`;
                        }
                    }
                ],
                placeholder: 'No hay pujas recientes',
                initialSort: [
                    { column: 'cantidad', dir: 'desc' }
                ]
            });
        }

        function actualizarTablaPujas() {
            if (tabulatorTable) {
                tabulatorTable.replaceData(pujas);
            }
        }

        // ============ ESTADÍSTICAS ============
        function actualizarStats() {
            const activas = subastasFiltradas.length;
            const precioMedio = subastasFiltradas.reduce((sum, s) => sum + s.precio, 0) / activas;
            
            document.getElementById('stats-activas').innerHTML = activas;
            document.getElementById('stats-precio').innerHTML = `${Math.round(precioMedio)}€`;
            document.getElementById('stats-pujas').innerHTML = pujas.length;
        }

        // ============ RESET DE TIMERS ============
        function pararTodosTimers() {
            timers.forEach(timer => {
                if (timer) timer.stop();
            });
            timers = [];
        }

        // ============ INICIALIZACIÓN ============
        document.addEventListener('DOMContentLoaded', () => {
            initSlider();
            initTablaPujas();
            renderizarSubastas();
            actualizarStats();
            
            // Cleanup al cambiar página
            window.addEventListener('beforeunload', pararTodosTimers);
        });
