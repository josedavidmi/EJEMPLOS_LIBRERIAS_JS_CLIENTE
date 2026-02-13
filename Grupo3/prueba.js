        // ============ DAY.JS - CONFIGURACIÓN ============
        dayjs.locale('es');
        
        // ============ DATOS DE EJEMPLO ============
        let gastos = [
            { fecha: '2026-02-05', concepto: 'Cena italiana', categoria: 'comida', importe: 45.50 },
            { fecha: '2026-02-07', concepto: 'Uber compartido', categoria: 'transporte', importe: 18.30 },
            { fecha: '2026-02-10', concepto: 'Cine', categoria: 'ocio', importe: 32.00 },
            { fecha: '2026-02-12', concepto: 'Comida rápida', categoria: 'comida', importe: 22.40 },
            { fecha: '2026-02-15', concepto: 'Taxi', categoria: 'transporte', importe: 15.75 },
            { fecha: '2026-02-18', concepto: 'Bolos', categoria: 'ocio', importe: 28.90 },
            { fecha: '2026-02-20', concepto: 'Supermercado', categoria: 'comida', importe: 35.20 },
            { fecha: '2026-02-22', concepto: 'Metro', categoria: 'transporte', importe: 12.50 },
            { fecha: '2026-02-25', concepto: 'Concierto', categoria: 'ocio', importe: 55.00 }
        ];

        // Variables globales
        let chartInstance = null;
        let mapa = null;
        let marcador = null;

        // ============ 1. CHART.JS - GRÁFICO POR CATEGORÍAS ============
        function actualizarGrafico(gastosFiltrados) {
            // Agrupar por categoría usando Day.js para fechas
            const categorias = {
                'comida': { nombre: 'Comida', total: 0, color: '#FF6B6B' },
                'transporte': { nombre: 'Transporte', total: 0, color: '#4ECDC4' },
                'ocio': { nombre: 'Ocio', total: 0, color: '#FFE66D' },
                'otros': { nombre: 'Otros', total: 0, color: '#A8E6CF' }
            };

            gastosFiltrados.forEach(gasto => {
                if (categorias[gasto.categoria]) {
                    categorias[gasto.categoria].total += gasto.importe;
                } else {
                    categorias['otros'].total += gasto.importe;
                }
            });

            // Calcular total
            const total = Object.values(categorias).reduce((sum, cat) => sum + cat.total, 0);
            document.getElementById('total-gastos').innerHTML = `Total: ${total.toFixed(2)}€`;

            // Preparar datos para el gráfico
            const datos = Object.values(categorias).filter(cat => cat.total > 0);
            
            if (chartInstance) {
                chartInstance.destroy();
            }

            const ctx = document.getElementById('grafico-gastos').getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: datos.map(d => d.nombre),
                    datasets: [{
                        data: datos.map(d => d.total),
                        backgroundColor: datos.map(d => d.color),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    cutout: '65%'
                }
            });

            // Actualizar tabla de gastos
            actualizarTabla(gastosFiltrados);
        }

        // ============ FILTRO POR FECHAS CON DAY.JS ============
        function aplicarFiltroFechas() {
            const inicio = document.getElementById('fecha-inicio').value;
            const fin = document.getElementById('fecha-fin').value;
            
            if (!inicio || !fin) return;

            // Usar Day.js para comparar fechas
            const fechaInicio = dayjs(inicio);
            const fechaFin = dayjs(fin);

            const gastosFiltrados = gastos.filter(gasto => {
                const fechaGasto = dayjs(gasto.fecha);
                return (fechaGasto.isAfter(fechaInicio) || fechaGasto.isSame(fechaInicio)) && 
                       (fechaGasto.isBefore(fechaFin) || fechaGasto.isSame(fechaFin));
            });

            actualizarGrafico(gastosFiltrados);
        }

        // ============ ACTUALIZAR TABLA ============
        function actualizarTabla(gastosMostrar) {
            const tbody = document.getElementById('tbody-gastos');
            tbody.innerHTML = gastosMostrar.sort((a, b) => dayjs(b.fecha).isAfter(dayjs(a.fecha)) ? 1 : -1)
                .map(gasto => {
                    const fechaFormateada = dayjs(gasto.fecha).format('DD/MM/YYYY');
                    const categoriaClass = `categoria categoria-${gasto.categoria}`;
                    
                    return `<tr>
                        <td>${fechaFormateada}</td>
                        <td>${gasto.concepto}</td>
                        <td><span class="${categoriaClass}">${gasto.categoria}</span></td>
                        <td><strong>${gasto.importe.toFixed(2)}€</strong></td>
                    </tr>`;
                }).join('');
        }

        // ============ 2. LEAFLET - MAPA ============
        function inicializarMapa() {
            // Coordenadas por defecto (Castro Urdiales)
            mapa = L.map('mapa').setView([43.37949354398391, -3.2172119720794625], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapa);

            // Marcador inicial
            marcador = L.marker([43.37949354398391, -3.2172119720794625]).addTo(mapa);
            marcador.bindPopup(" I.E.S. Ataul Argenta, Castro Urdiales").openPopup();
            
            document.getElementById('info-quedada').innerHTML = "📍 Quedada: I.E.S. Ataulfo Argenta, Castro Urdiales - 20/02/2026";
        }

        function actualizarMapa() {
            const lugar = document.getElementById('lugar-quedada').value;
            if (!lugar) return;

            // Simular geocodificación (ejemplo práctico)
            // En un caso real usarías Nominatim o similar
            alert(` Buscando: ${lugar}\n(En un caso real se geocodificaría la dirección)`);
            
            // Simular nueva ubicación (coordenadas aleatorias cercanas)
            const lat = 43.37949354398391 + (Math.random() - 0.5) * 0.1;
            const lng = -3.2172119720794625 + (Math.random() - 0.5) * 0.1;
            
            mapa.setView([lat, lng], 15);
            
            if (marcador) {
                mapa.removeLayer(marcador);
            }
            
            marcador = L.marker([lat, lng]).addTo(mapa);
            marcador.bindPopup(` ${lugar}`).openPopup();
            
            document.getElementById('info-quedada').innerHTML = `📍 Quedada: ${lugar} - ${dayjs().format('DD/MM/YYYY')}`;
        }

        // ============ 3. SORTABLEJS - ORDENAR PARTICIPANTES ============
        function inicializarSortable() {
            const lista = document.getElementById('lista-participantes');
            
            new Sortable(lista, {
                animation: 300,
                handle: '.drag-handle',
                ghostClass: 'participante-item-ghost',
                dragClass: 'participante-item-drag',
                onEnd: function(evt) {
                    console.log(' Orden actualizado:', evt.newIndex);
                    // Animación simple
                    evt.item.style.transform = 'translateX(0)';
                }
            });
        }

        // ============ CREAR NUEVA QUEDADA ============
        function crearQuedada() {
            const nombre = document.getElementById('nombre-quedada').value;
            const fecha = document.getElementById('fecha-quedada').value;
            
            if (!nombre || !fecha) {
                alert(' Por favor, completa todos los campos');
                return;
            }

            const fechaFormateada = dayjs(fecha).format('DD/MM/YYYY');
            alert(` Quedada creada: "${nombre}" para el ${fechaFormateada}`);
            
            // Limpiar campos
            document.getElementById('nombre-quedada').value = '';
        }

        // ============ INICIALIZACIÓN ============
        document.addEventListener('DOMContentLoaded', () => {
            // Inicializar fechas por defecto con Day.js
            const hoy = dayjs();
            const inicioMes = hoy.startOf('month').format('YYYY-MM-DD');
            const finMes = hoy.endOf('month').format('YYYY-MM-DD');
            
            document.getElementById('fecha-inicio').value = inicioMes;
            document.getElementById('fecha-fin').value = finMes;
            
            // Inicializar componentes
            inicializarMapa();
            inicializarSortable();
            
            // Aplicar filtro inicial
            aplicarFiltroFechas();
        });
